import { Page, Locator } from '@playwright/test';
import { TestMemoryTableManager } from './testMemoryTable';

export class TagManager {
  /**
   * Checks if a requested tag exists in the current page context (dropdown options, chips, or lists).
   * If it exists, records it as PRE-EXISTING with action FOUND.
   * If it does NOT exist, creates a new tag dynamically, tracks it on world for cleanup,
   * and records it as DYNAMICALLY_CREATED with action CREATED.
   */
  public static async ensureTagExists(
    page: Page,
    requestedTagName: string,
    world?: any
  ): Promise<{ tagName: string; isNew: boolean }> {
    const scenarioName = world?.currentScenario?.pickle?.name || world?.scenario?.pickle?.name || 'Tag Scenario';
    console.log(`[TagManager] Ensuring tag exists: "${requestedTagName}" in scenario "${scenarioName}"...`);

    // 1. Check if the tag already exists in any relevant UI component
    const exists = await this.checkTagInUI(page, requestedTagName);
    if (exists) {
      console.log(`[TagManager] Tag "${requestedTagName}" exists in the system (PRE-EXISTING). Proceeding.`);
      if (world) {
        if (!world.preExistingTestTags) world.preExistingTestTags = [];
        if (!world.preExistingTestTags.includes(requestedTagName)) {
          world.preExistingTestTags.push(requestedTagName);
        }
      }
      TestMemoryTableManager.recordTagActivity(requestedTagName, scenarioName, 'FOUND', 'PRE-EXISTING');
      return { tagName: requestedTagName, isNew: false };
    }

    // 2. Tag does not exist — dynamically create it
    console.log(`[TagManager] Tag "${requestedTagName}" not found. Creating new tag dynamically...`);
    const createdTagName = await this.createTagInUI(page, requestedTagName);

    // Track on world for post-scenario deletion
    if (world) {
      if (!world.createdTestTags) world.createdTestTags = [];
      if (!world.createdTestTags.includes(createdTagName)) {
        world.createdTestTags.push(createdTagName);
      }
    }

    TestMemoryTableManager.recordTagActivity(createdTagName, scenarioName, 'CREATED', 'DYNAMICALLY_CREATED');
    return { tagName: createdTagName, isNew: true };
  }

  /**
   * Helper to check if a tag name is visible in options, comboboxes, or chips.
   */
  private static async checkTagInUI(page: Page, tagName: string): Promise<boolean> {
    try {
      const optionLocator = page.getByRole('option', { name: new RegExp(`^${tagName}$`, 'i') }).first();
      if (await optionLocator.isVisible({ timeout: 1500 }).catch(() => false)) {
        return true;
      }

      const chipLocator = page.locator('.tag, .tag-chip, .badge, [class*="tag"]').filter({ hasText: new RegExp(tagName, 'i') }).first();
      if (await chipLocator.isVisible({ timeout: 1000 }).catch(() => false)) {
        return true;
      }

      const textLocator = page.getByText(tagName, { exact: true }).first();
      if (await textLocator.isVisible({ timeout: 1000 }).catch(() => false)) {
        return true;
      }
    } catch {
      // Ignored
    }
    return false;
  }

  /**
   * Helper to create a new tag in the current UI state.
   */
  private static async createTagInUI(page: Page, requestedTagName: string): Promise<string> {
    const tagName = requestedTagName || `Tag_${Date.now().toString().slice(-5)}`;

    try {
      // Method A: Lesson Editor "Add tags..." field
      const addTagsInput = page.getByPlaceholder(/Add tags/i).first();
      if (await addTagsInput.isVisible({ timeout: 1500 }).catch(() => false)) {
        await addTagsInput.click().catch(() => {});
        await addTagsInput.fill(tagName).catch(() => {});
        await page.keyboard.press('Enter').catch(() => {});
        console.log(`[TagManager] Created tag "${tagName}" via Add tags input.`);
        return tagName;
      }

      // Method B: Combobox text input
      const comboboxInput = page.locator('.ts-control input, input[placeholder*="tag" i], [role="combobox"]').first();
      if (await comboboxInput.isVisible({ timeout: 1500 }).catch(() => false)) {
        await comboboxInput.click().catch(() => {});
        await comboboxInput.fill(tagName).catch(() => {});
        await page.keyboard.press('Enter').catch(() => {});
        console.log(`[TagManager] Created tag "${tagName}" via Combobox input.`);
        return tagName;
      }

      // Method C: Manage tags modal / Tag settings
      const editTagNameBox = page.getByRole('textbox', { name: 'Tag name' }).first();
      const saveBtn = page.getByRole('button', { name: 'Save' }).first();
      if (await editTagNameBox.isVisible({ timeout: 1500 }).catch(() => false)) {
        await editTagNameBox.fill(tagName).catch(() => {});
        if (await saveBtn.isVisible().catch(() => false)) {
          await saveBtn.click().catch(() => {});
        }
        console.log(`[TagManager] Created tag "${tagName}" via Manage tags modal.`);
        return tagName;
      }
    } catch (err) {
      console.warn(`[TagManager] Note during tag creation: ${(err as Error).message}`);
    }

    return tagName;
  }

  /**
   * Cleans up dynamically created tags and retains pre-existing tags.
   * Updates their action and status in the memory table.
   */
  public static async cleanupCreatedTags(page: Page, world: any): Promise<void> {
    const scenarioName = world?.currentScenario?.pickle?.name || world?.scenario?.pickle?.name || 'Tag Scenario';

    // 1. Clean up dynamically created tags
    if (world && world.createdTestTags && world.createdTestTags.length > 0) {
      const tagsToDelete = [...world.createdTestTags];
      console.log(`[TagManager] Starting cleanup for ${tagsToDelete.length} scenario-created tag(s)...`);

      for (const tagName of tagsToDelete) {
        let cleanupSucceeded = false;
        try {
          console.log(`[TagManager] Deleting created tag "${tagName}"...`);

          // Attempt 1: Remove button on tag chip
          const removeChipBtn = page.getByRole('button', { name: new RegExp(`Remove ${tagName}`, 'i') }).first()
            .or(page.locator('.tag, .tag-chip, .badge').filter({ hasText: tagName }).locator('.remove, .close, button').first())
            .or(page.locator(`button[aria-label*="Remove ${tagName}" i]`).first());

          if (await removeChipBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
            await removeChipBtn.click().catch(() => {});
            console.log(`[TagManager] Detached tag "${tagName}" via chip remove button.`);
            cleanupSucceeded = true;
          }

          // Attempt 2: Delete tag button in Tag Settings / Manage tags modal
          const deleteBtn = page.getByRole('button', { name: new RegExp(`Delete ${tagName}`, 'i') }).first();
          if (await deleteBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
            page.once('dialog', async (dialog) => {
              await dialog.accept().catch(() => {});
            });
            await deleteBtn.click().catch(() => {});
            console.log(`[TagManager] Deleted tag "${tagName}" permanently via Tag settings dialog.`);
            cleanupSucceeded = true;
          }

          TestMemoryTableManager.recordTagActivity(tagName, scenarioName, 'CLEANED_UP', 'CLEANED_UP');
        } catch (err) {
          console.warn(`[TagManager] Note while deleting tag "${tagName}": ${(err as Error).message}`);
          TestMemoryTableManager.recordTagActivity(tagName, scenarioName, 'CLEANED_UP', cleanupSucceeded ? 'CLEANED_UP' : 'FAILED');
        }
      }
      world.createdTestTags = [];
    }

    // 2. Retain pre-existing tags
    if (world && world.preExistingTestTags && world.preExistingTestTags.length > 0) {
      const tagsToRetain = [...world.preExistingTestTags];
      for (const tagName of tagsToRetain) {
        console.log(`[TagManager] Tag "${tagName}" was PRE-EXISTING. Retaining without deletion.`);
        TestMemoryTableManager.recordTagActivity(tagName, scenarioName, 'RETAINED', 'PRE-EXISTING');
      }
      world.preExistingTestTags = [];
    }
  }
}

import * as fs from 'fs';
import * as path from 'path';

export interface CredentialRecord {
  timestamp: string;
  runId: string;
  scenarioName: string;
  email: string;
  password: string;
  status: 'ACTIVE' | 'USED' | 'FAILED';
  counter: number;
}

export interface TagRecord {
  timestamp: string;
  scenarioName: string;
  tagName: string;
  action: 'FOUND' | 'CREATED' | 'CLEANED_UP' | 'RETAINED';
  status: 'PRE-EXISTING' | 'DYNAMICALLY_CREATED' | 'CLEANED_UP' | 'FAILED';
}

export interface MemoryTableSchema {
  registration: {
    lastCounter: number;
    history: CredentialRecord[];
  };
  tags: {
    history: TagRecord[];
  };
}

const DEFAULT_MEMORY_TABLE: MemoryTableSchema = {
  registration: {
    lastCounter: 0,
    history: [],
  },
  tags: {
    history: [],
  },
};

export class TestMemoryTableManager {
  private static filePath: string = path.resolve(process.cwd(), 'test-memory-table.json');

  /**
   * Reads and parses the memory table from disk. Initializes with default structure if not found.
   */
  public static readTable(): MemoryTableSchema {
    try {
      if (!fs.existsSync(this.filePath)) {
        this.writeTable(DEFAULT_MEMORY_TABLE);
        return JSON.parse(JSON.stringify(DEFAULT_MEMORY_TABLE));
      }
      const raw = fs.readFileSync(this.filePath, 'utf8');
      const data = JSON.parse(raw);
      if (!data.registration) data.registration = { lastCounter: 0, history: [] };
      if (!data.tags) data.tags = { history: [] };
      return data;
    } catch (err) {
      console.warn(`[MemoryTable] Warning reading memory table, initializing fresh: ${(err as Error).message}`);
      return JSON.parse(JSON.stringify(DEFAULT_MEMORY_TABLE));
    }
  }

  /**
   * Persists the memory table to disk synchronously.
   */
  public static writeTable(table: MemoryTableSchema): void {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(table, null, 2), 'utf8');
    } catch (err) {
      console.error(`[MemoryTable] Error writing memory table to ${this.filePath}: ${(err as Error).message}`);
    }
  }

  /**
   * Generates the next sequential registration credentials based on the memory table counter.
   *
   * Logic:
   * - Base email: Testregister@gmail.com
   * - Run 1: Testregister@gmail.com, password TestPass@1
   * - Run 2: Testregister+1@gmail.com, password TestPass@2
   * - Run 3: Testregister+2@gmail.com, password TestPass@3
   * - ...and so on.
   * - Status: ACTIVE upon generation.
   */
  public static getNextRegistrationCredentials(scenarioName?: string): CredentialRecord {
    const table = this.readTable();
    const currentCounter = (table.registration.lastCounter || 0) + 1;

    let email: string;
    if (currentCounter === 1) {
      email = 'Testregister@gmail.com';
    } else {
      email = `Testregister+${currentCounter - 1}@gmail.com`;
    }

    const password = `TestPass@${currentCounter}`;
    const timestamp = new Date().toISOString();
    const resolvedScenario = scenarioName || `Registration Run ${currentCounter}`;

    const record: CredentialRecord = {
      timestamp,
      runId: `Run_${currentCounter}`,
      scenarioName: resolvedScenario,
      email,
      password,
      status: 'ACTIVE',
      counter: currentCounter,
    };

    table.registration.lastCounter = currentCounter;
    table.registration.history.push(record);
    this.writeTable(table);

    console.log(`[MemoryTable] Registration generated -> Counter: ${currentCounter} | Email: ${email} | Status: ACTIVE`);
    return record;
  }

  /**
   * Updates an existing registration credential's status to USED or FAILED.
   *
   * @param email The registered email
   * @param status 'USED' or 'FAILED'
   * @param scenarioName Optional scenario name for auditing
   */
  public static updateRegistrationStatus(
    email: string,
    status: 'USED' | 'FAILED',
    scenarioName?: string
  ): void {
    const table = this.readTable();
    const record = [...table.registration.history]
      .reverse()
      .find((r) => r.email.toLowerCase() === email.toLowerCase());

    if (record) {
      record.status = status;
      if (scenarioName && !record.scenarioName) {
        record.scenarioName = scenarioName;
      }
      this.writeTable(table);
      console.log(`[MemoryTable] Registration status updated -> Email: ${email} | Status: ${status}`);
    } else {
      console.warn(`[MemoryTable] Could not find registration record for email: ${email} to update status to ${status}`);
    }
  }

  /**
   * Records tag activity to the memory table.
   *
   * @param tagName Name of the tag used or generated
   * @param scenarioName Name of the running scenario
   * @param action 'FOUND' | 'CREATED' | 'CLEANED_UP' | 'RETAINED'
   * @param status 'PRE-EXISTING' | 'DYNAMICALLY_CREATED' | 'CLEANED_UP' | 'FAILED'
   */
  public static recordTagActivity(
    tagName: string,
    scenarioName: string,
    action: 'FOUND' | 'CREATED' | 'CLEANED_UP' | 'RETAINED',
    status: 'PRE-EXISTING' | 'DYNAMICALLY_CREATED' | 'CLEANED_UP' | 'FAILED'
  ): TagRecord {
    const table = this.readTable();
    const timestamp = new Date().toISOString();

    const record: TagRecord = {
      timestamp,
      scenarioName: scenarioName || 'Tag Scenario',
      tagName,
      action,
      status,
    };

    table.tags.history.push(record);
    this.writeTable(table);

    console.log(`[MemoryTable] Tag activity recorded -> Tag: "${tagName}" | Action: ${action} | Status: ${status} | Scenario: "${scenarioName}"`);
    return record;
  }

  /**
   * Helper to mark a tag as cleaned up.
   */
  public static markTagDeleted(tagName: string, scenarioName?: string): void {
    this.recordTagActivity(tagName, scenarioName || 'Tag Cleanup', 'CLEANED_UP', 'CLEANED_UP');
  }
}

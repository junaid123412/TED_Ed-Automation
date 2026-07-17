Feature: Landing Page and Discovery Extended Scenarios (101-160)

  This feature file contains scenarios 101 through 160 added to the suite.

  @landing @extended
  Scenario: 101 - Resource Link Redirection
    Given user is an approved Leader
    When they click "Access your resources"
    Then a new tab opens pointing to "Welcome to Hub test" domain

  Scenario: 102 - Renew Application Pathway
    Given user is on Student Talks page
    When they click "Renew application"
    Then system displays "Submit an application to the TED-Ed..." header

  Scenario: 103 - Responsive Grid Layout
    Given user scrolls to shared ideas section
    When viewport is resized to mobile width
    Then video thumbnails must dynamically stack into a single column

  Scenario: 104 - Documentation Pack Link
    Given user reviews "How to apply" info
    When they click "TED-Ed Student Talks Information packet" link
    Then document should display or download matching latest active version

  Scenario: 105 - Progressive Tracker Initialization
    Given user is on introductory page
    When they click "Let's get started"
    Then Step 1 of 2 should initialize and state tracker reads "Step 1"

  Scenario: 106 - Fallback Entity Lookup
    Given user is on Step 1
    When they select "United Arab Emirates" and search for organization "500"
    Then result container displays a "Create a new one here" link option

  Scenario: 107 - State Localization Rules
    Given user chooses to create organization manually
    When they switch Country selection from "UAE" to "Pakistan"
    Then "State \/ Province \/ Region" resets to present specific Pakistani provinces

  Scenario: 108 - Postal Code Boundary Check
    Given user populates profile details missing the Postal Code entry
    When they click "Continue" button
    Then system activates inline error declaring "Postal code can't be blank"

  Scenario: 109 - Website Format Validation
    Given user encounters form errors on Step 1
    When they input an unformatted string payload like "qewqewqewqew" into website input
    Then inline system label displays stating "Website is not a valid URL"

  Scenario: 110 - Browser Save Modal Dismissal
    Given browser surfaces "Update address?" overlay panel
    When user explicitly clicks the "X" close icon on the modal block
    Then overlay dismisses without disrupting active web application state

  Scenario: 111 - Error Flag Resolution
    Given website box shows "Website is not a valid URL" status
    When user updates value to "http://www.pakistan.com" and clicks "Continue"
    Then the validation state error message must dynamically clear away instantly

  Scenario: 112 - Mandatory Input Restrictions
    Given user leaves "Organization Name" and "Address Line 1" completely empty
    When they submit Step 1
    Then highlighting style emphasizes those missing required input fields

  Scenario: 113 - Organization Selection Focus
    Given user is selecting organization types under Step 1
    When they select "Your School" and then click "A non-profit youth organization"
    Then system deselects "Your School" to uphold mutual exclusivity rules

  Scenario: 114 - Mission Box Bounds Check
    Given system presents text field "Tell us more about your organization's mission"
    When user inputs characters exceeding maximum allowable boundary limits
    Then input window trims or truncates the extra tail characters gracefully

  Scenario: 115 - Session State Backwards Move
    Given user progresses past Step 1 elements onto Step 2 screen window
    When they click the browser's native hardware Back navigation control
    Then Step 1 details load clean with all input data correctly preserved

  Scenario: 116 - Missing Goals Exception
    Given user is configuring Step 2 educator details
    When they ignore the skills listing and hit "Submit application"
    Then top warning box banner fires stating "Exactly 3 Improvement goals are required"

  Scenario: 117 - Partial Selection Matrix
    Given validation rules dictate exactly three selections must be activated
    When user only checks two goals: "Confidence" and "Critical thinking"
    Then form tracking stays in fault state stating "Exactly 3 Improvement goals are required"

  Scenario: 118 - Goals Criteria Clearance
    Given application layout registers a "2/3" sub-counter tracking condition
    When user ticks a third option like "Speaking and listening skills"
    Then active warning message "Exactly 3 Improvement goals are required" dismisses

  Scenario: 119 - Participant Multi-Selections
    Given system requests target participants under program age groups
    When user checks "Elementary School (ages 8-11)" and "High School (ages 15-18)" together
    Then both checkbox selection structures retain active visual styles

  Scenario: 120 - Identity List Identification
    Given user opens "Please select the option that best identifies your role..."
    When they match selection against "Early Childhood Educator (ECE) Teacher"
    Then that specific item configuration locks into active selection window row

  Scenario: 121 - Descriptive String Captures
    Given text entry box reading "How do you envision your students participating..."
    When user types alphanumeric testing strings into input bounds
    Then text box captures and displays that alphanumeric data string cleanly

  Scenario: 122 - Conditional Dropdown Trigger
    Given form prompts "Have you approved an application previously..."
    When user sets selection radio toggle status value to "Yes..."
    Then nested query reading "How many times have you completed a program cycle..." exposes

  Scenario: 123 - Cycle Count Limits Matrix
    Given past experience sub-question drop-down selection panel is exposed
    When user expands numerical list interaction tracking element
    Then iteration dropdown presents sequential option rows from "1" up through "6+"

  Scenario: 124 - Implementation Exclusivity
    Given user evaluates implementation format question list frame
    When user swaps states between "One class of students" and "Multiple classes"
    Then only a single selection item bubble remains active at any given time

  Scenario: 125 - Benefits Field Verification
    Given user omits typing content into "Who are your students and why do you think..."
    When they click "Submit application" primary handler button link
    Then targeted text area component switches into a validation fault state

  Scenario: 126 - Submission Completion Forward Route
    Given all form inputs across Step 1 and Step 2 contain valid parameters
    When user clicks final "Submit application" primary action link
    Then page endpoint shifts to display the confirmation "Thank You!" layout

  Scenario: 127 - Submission Cycle Window Metrics
    Given user arrives safely at submission confirmation completion page view
    When application parses programmatic active submission cycle windows
    Then localized copywriting provides dynamic notification notes of review dates

  Scenario: 128 - Operational Schedule Grid
    Given user audits timeline matrices at the bottom tier of Thank You page
    When layout engine renders columns for application Open, Close, and Approval dates
    Then cells display values matching scheduled operational milestone definitions

  Scenario: 129 - Footer Subscriptions Module
    Given user completes workflow tracking and validates footer structures
    When they insert target email string and click adjacent "Subscribe" control
    Then component handles data dispatch and outputs completion state status layout

  Scenario: 130 - Historic Step Security Check
    Given application workflow has reached a finalized confirmation status
    When user tries to access Step 2 parameters directly using cached deep URLs
    Then layout router redirects user gracefully back to landing index dashboard

  Scenario: 131 - Lessons Navigation Direct
    Given user hovers over header navigation item "Discover"
    When they click "Watch video-based lessons organized by subject and age"
    Then exploration browse endpoint browser page URL path contains "\/lessons"

  Scenario: 132 - Subject Tree Structures
    Given user expands "Subjects" accordion container on lesson side menu
    When user reviews available nesting child category nodes
    Then options matching "The Arts", "Business & Economics", and "Health" show cleanly

  Scenario: 133 - Inner Subject Check Matrix
    Given user expands "The Arts" subject menu section
    When they check "Visual Arts" and then tick "Performing Arts" checkbox control
    Then both items register selected indicators and refresh active display grid rows

  Scenario: 134 - Broad Cross-Subject Matrix
    Given user has checked "Visual Arts" filter option within the side panel
    When they navigate down to check "Growth & Development" under "Health" category
    Then system display results update to capture items crossing both domains

  Scenario: 135 - Total Selection Badges
    Given user sets custom filter selections inside menu accordion controls
    When two items are toggled active within "The Arts" categories listing
    Then red badge reading "1" must display adjacent to root header string "Subjects"

  Scenario: 136 - Mass Filtering Cancellations
    Given lesson discovery dashboard presents filtered visual content card items
    When user clicks the global shortcut text link labeled "Clear all"
    Then all checked filter nodes drop and list returns to default parameters

  Scenario: 137 - Level Accordion Flags
    Given user opens the "Student Level" accordion menu dropdown row
    When user checks option node checkbox control labeled "Legendry"
    Then a red selection indicator counter badge reading "1" appears on parent row

  Scenario: 138 - Grade Bounds Combinations
    Given user checks active selection filter option node "Legendry"
    When user appends additional filter parameters by checking "Elementary/Primary"
    Then discovery item container aggregates results matching either parameter cleanly

  Scenario: 139 - Subtitle Panel Dropdowns
    Given user scrolls down to bottom tier filter component blocks
    When they click dynamic toggle layout box element "Subtitles"
    Then interactive list presenting options like "Afrikaans" and "Albanian" expands

  Scenario: 140 - Captions Parameter Mapping
    Given subtitle language picker scrolling framework is expanded completely
    When user clicks focus state checkbox indicator designated for "Afrikaans"
    Then query parameters within browser address location bar string map updates

  Scenario: 141 - Duration Slider Min Ranges
    Given user opens lesson slider framework widget titled "Duration"
    When they drag slide handle limits to bound max constraints to "0-30 min"
    Then system layout adjusts data models matching designated timeline scale boundaries

  Scenario: 142 - Duration Slider Lower Bounds
    Given user updates timeline scale boundary range conditions on filters
    When slider tracking scale thresholds shift to show "6 min - 30 min" range limits
    Then grid output updates and omits items with runtimes below the six-minute mark

  Scenario: 143 - Inline Favorites Interactions
    Given user moves pointer focus over video item card "Need For Speed Most Wanted"
    When they click active inline heart component icon link layout frame
    Then dialog block modal reading "Add to Collection" overlays viewport screen

  Scenario: 144 - Collection Creation Prompts
    Given user triggers "Add to Collection" interaction panel framework overlay
    When they click secondary execution button control labeled "Create & Add"
    Then input popup frame labeled "Create new Collection" demands alphanumeric title

  Scenario: 145 - Saved Group Notifications
    Given input field path "Create new Collection" is active on viewport layer
    When user inserts title string "New Collection 2" and clicks "Create & Add"
    Then toast status message "Lesson added to your New Collection 2..." pops into view

  Scenario: 146 - Toggling Saved Favorites
    Given lesson thumbnail item shows active filled indicator style property state
    When user clicks that same active target heart widget button once more
    Then transient toast string "Lesson removed from your favorites collection." manifests

  Scenario: 147 - Trending Re-sorting Layouts
    Given user inspects sorting tabs along upper shelf of discovery area
    When they click specific item sorting target button labeled "Trending"
    Then item grid reloads contents displaying trending order matrix arrays

  Scenario: 148 - Newest Timeline Layouts
    Given user wants to audit newly posted lesson items inside system directory
    When they click sorting choice parameter tab component named "Newest"
    Then lesson item grid updates sorting order showing newest timeline uploads first

  Scenario: 149 - View-Volume Sorting Arrays
    Given user is on exploration dashboard search result presentation layout
    When they select final sorting filter element choice column titled "Most views"
    Then primary lesson tile situated at index 0 slot holds highest total views counter

  Scenario: 150 - Dynamic Promo Redirections
    Given user views promo block reading "Want a daily email of lesson plans...?"
    When they click the navigation button link block labeled "Learn more"
    Then page context changes to load "Teaching or learning from home?" portal view

  Scenario: 151 - Page Jump Action Row
    Given user scrolls to the bottom pagination tracking row of lesson dashboard
    When they click index page pagination indicator number button labeled "2"
    Then pagination locator framework highlights step 2 as active viewing slice

  Scenario: 152 - Extreme Tail Pagination
    Given user jumps directly to extreme far rows of system database entries
    When they click tail end page numeric indicators or index structures like "80"
    Then view grid layer lists data entries matching that index step without error

  Scenario: 153 - Backward Page Adjustments
    Given user session is looking at records inside page step window index 76
    When they click left angle bracket step adjust directional pagination controller
    Then list system step updates backwards loading records matching page 75

  Scenario: 154 - Auto-Suggest Dropdowns
    Given user focuses search input box component on header navigation bar
    When they type search query characters matching alphanumeric pattern "where"
    Then suggestion panel popup rows drop down highlighting historical query phrases

  Scenario: 155 - Enter-Key Dispatch Matrix
    Given user enters explicitly structured query string "where" into search bar
    When they hit hardware Enter keyboard key to finalize search dispatch sequence
    Then main results view display title string prints "Results for \"where\" (233)"

  Scenario: 156 - Inline Results Interactivity
    Given system layout outputs matching search criteria query rows for phrase "where"
    When user clicks heart favorite tracker component on a returned video item card
    Then dynamic target system window reading "Lesson added to your favorites..." shows

  Scenario: 157 - Search Selection Links
    Given user views searched list records within discovery page framework viewport
    When they click title text element container of card row "GAC Aion UT First Look"
    Then target lesson presentation screen matches selection and plays video content

  Scenario: 158 - Back Browser Interactivity
    Given user has opened specific video player lesson content from search filters
    When user strikes standard hardware or browser Back button tracking mechanism
    Then view returns to exact position along discovery index search results block

  Scenario: 159 - Secondary Category Swaps
    Given user interacts with filters on discovery search item listing dashboard
    When they select secondary navigation header tab option element "Create"
    Then panel expands showing matching options like "Create a lesson" securely

  Scenario: 160 - Footer Form Transactions
    Given user scrolls down to global page baseline footer section layout lines
    When they input structured email pattern "test@email.com" into newsletter field
    Then footer validation maps input tracking asset and renders confirmation graphics

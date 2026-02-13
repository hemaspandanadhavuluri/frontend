# TODO: Fix Lead Location Display Issue

## Problem
In the assigner panel, when sending a lead from the counsellor, the lead location was showing as "na" instead of 'N/A' or the actual location.

## Root Cause
- The counsellor could leave the permanent address field blank or enter "na", which would be displayed as-is in the assigner panel.
- The display logic only checked for falsy values, not specific invalid inputs like "na".

## Solution Implemented
- [x] Updated AssignerPanel.jsx to display 'N/A' if permanentLocation is empty, "na" (case insensitive), or undefined.
- [x] Made the permanentAddress field required in Home_Counsellor.jsx to ensure counsellors always provide a location.

## Changes Made
1. **AssignerPanel.jsx**: Changed the location display logic to:
   ```jsx
   Location: {(!lead.permanentLocation || lead.permanentLocation.toLowerCase() === 'na') ? 'N/A' : lead.permanentLocation}
   ```

2. **Home_Counsellor.jsx**: Added `required` attribute to the permanentAddress input field.

## Testing
- Verify that leads with empty or "na" locations now show 'N/A' in the assigner panel.
- Confirm that the counsellor form now requires the permanent address field to be filled.

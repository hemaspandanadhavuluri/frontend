# TODO: Make Recent Submissions Dynamic

## Backend Changes
- [ ] Add `getRecentSubmissionsForCounsellor` function in `leadController.js`
- [ ] Add route `/recent/:counsellorId` in `leadRoutes.js`

## Frontend Changes
- [ ] Replace hard-coded `recentSubmissions` with state in `Home_Counsellor.jsx`
- [ ] Add `useEffect` to fetch recent submissions on mount
- [ ] Add `useEffect` to fetch counsellor stats on mount
- [ ] Refresh recent submissions after successful lead submission
- [ ] Map API data to display format (name, amount, country, status)

## Testing
- [ ] Test API endpoint for recent submissions
- [ ] Test frontend dynamic loading
- [ ] Verify Assigner Panel shows new leads

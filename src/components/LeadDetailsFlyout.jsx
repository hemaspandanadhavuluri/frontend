import { Drawer, Box, Typography, IconButton, Divider, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
// Import your massive form component
import LeadForm from './LeadForm'; 

const LeadDetailsFlyout = ({ selectedLead, isOpen, onClose, onSave }) => {
  // Pass the selected lead data to the LeadForm component
  if (!selectedLead) return null;

  return (
    <Drawer
      anchor="right" // Slide in from the right
      open={isOpen}
      onClose={onClose}
      // Use a wide paper for the complex form (e.g., 80vw on large screens)
      PaperProps={{ sx: { width: { xs: '100%', sm: '80%', md: '70%', lg: '60%' } } }}
    >
      <Box role="presentation" sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        
        {/* Fixed Header */}
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h5">
            Lead Details: {selectedLead.fullName}
          </Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>

        {/* Scrollable Form Content */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
          {/* The full LeadForm component (which contains all the sections 
            like Basic Info, Education, Family, etc.) goes here.
            You'll need to update LeadForm to receive lead data as a prop 
            and manage its internal state/changes.
          */}
          <LeadForm initialLeadData={selectedLead} onUpdate={onSave} isReadOnly={false} />
        </Box>

        {/* Fixed Footer for Actions (Optional) */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onClose} sx={{ mr: 1 }}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={() => onSave(selectedLead)}>Save Changes</Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default LeadDetailsFlyout;
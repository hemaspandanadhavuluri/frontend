import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Grid,
    Divider,
    Chip
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import PublicIcon from '@mui/icons-material/Public';

import './ContactCardSection.css';

const ContactCardSection = ({ lead }) => {
    return (
        <Card variant="outlined" sx={{ mb: 4, borderColor: 'primary.main', borderWidth: 2 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                    📞 Contact Card
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                    {/* Full Name */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                Full Name
                            </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ pl: 4 }}>
                            {lead.fullName || 'Not provided'}
                        </Typography>
                    </Grid>

                    {/* Email */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                Email Address
                            </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ pl: 4 }}>
                            {lead.email || 'Not provided'}
                        </Typography>
                    </Grid>

                    {/* Mobile Numbers */}
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <PhoneIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                Mobile Numbers
                            </Typography>
                        </Box>
                        <Box sx={{ pl: 4 }}>
                            {lead.mobileNumbers && lead.mobileNumbers.length > 0 ? (
                                lead.mobileNumbers.map((mobile, index) => (
                                    <Chip
                                        key={index}
                                        label={mobile}
                                        variant="outlined"
                                        color="primary"
                                        sx={{ mr: 1, mb: 1 }}
                                    />
                                ))
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    No mobile numbers provided
                                </Typography>
                            )}
                        </Box>
                    </Grid>

                    {/* Permanent Location */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                Permanent Location
                            </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ pl: 4 }}>
                            {lead.permanentLocation || 'Not provided'}
                        </Typography>
                    </Grid>

                    {/* State */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                State
                            </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ pl: 4 }}>
                            {lead.state || 'Not provided'}
                        </Typography>
                    </Grid>

                    {/* Regional Head */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                Regional Head
                            </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ pl: 4 }}>
                            {lead.regionalHead || 'Not provided'}
                        </Typography>
                    </Grid>

                    {/* Region */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                Region
                            </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ pl: 4 }}>
                            {lead.region || 'Not provided'}
                        </Typography>
                    </Grid>

                    {/* Planning to Study */}
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <PublicIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                Planning to Study in
                            </Typography>
                        </Box>
                        <Box sx={{ pl: 4 }}>
                            {lead.planningToStudy ? (
                                <Chip
                                    label={lead.planningToStudy}
                                    color={lead.planningToStudy === 'Abroad' ? 'secondary' : 'primary'}
                                    variant="filled"
                                />
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    Not specified
                                </Typography>
                            )}
                        </Box>
                    </Grid>

                    {/* Source (if available) */}
                    {lead.source && lead.source.source && (
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                    Lead Source
                                </Typography>
                            </Box>
                            <Typography variant="body1" sx={{ pl: 4 }}>
                                {lead.source.source}
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </CardContent>
        </Card>
    );
};

export default ContactCardSection;

import React, { useState } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress
} from '@mui/material';
import { UploadFile, CheckCircle, CloudUpload, Visibility } from '@mui/icons-material';
import { API_URL } from '../constants';

const documentTypes = [
    "Student Aadhar", "Student PAN Card", "Student Passport Size Photo", "Student Passport",
    "Student 10th Class Certificate", "Student 12th Degree Certificate", "Student UG Marksheet",
    "Student Test Score Cards", "Student Admission Letter", "Student Work Experience Letter", "Student Visa"
];

const API_BASE_URL = 'https://justtapcapital.com'; // The base URL of your backend

const DocumentCenter = ({ lead, onUpdate, isReadOnly = false }) => {
    const [open, setOpen] = useState(false);
    const [selectedDocType, setSelectedDocType] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    const getDocumentForType = (docType) => {
        return lead.documents?.find(doc => doc.documentType === docType);
    };

    const handleOpen = (docType) => {
        setSelectedDocType(docType);
        setSelectedFile(null);
        setMessage('');
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setMessage('Please select a file to upload.');
            return;
        }

        setUploading(true);
        setMessage('');

        const formData = new FormData();
        formData.append('document', selectedFile);
        formData.append('documentType', selectedDocType);

        try {
            const response = await axios.post(`${API_URL}/${lead._id}/upload-document`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            onUpdate(response.data); // Update the parent component with the new lead data
            setMessage('Upload successful!');
            setTimeout(() => {
                handleClose();
            }, 1500);
        } catch (error) {
            console.error('File upload failed:', error);
            setMessage(error.response?.data?.message || 'File upload failed.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <List>
                {documentTypes.map((docType) => {
                    const doc = getDocumentForType(docType);
                    return (
                        <ListItem key={docType} divider>
                            <ListItemIcon>
                                {doc ? <CheckCircle color="success" /> : <UploadFile color="disabled" />}
                            </ListItemIcon>
                            <ListItemText primary={docType} />
                            {doc ? (
                                <Button
                                    variant="outlined"
                                    color="success"
                                    startIcon={<Visibility />}
                                    href={`${API_BASE_URL}${doc.filePath}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View
                                </Button>
                            ) : ( !isReadOnly && (
                                    <Button
                                        variant="contained"
                                        startIcon={<CloudUpload />}
                                        onClick={() => handleOpen(docType)}
                                    >
                                        Upload
                                    </Button>
                                )
                            )
                        }
                        </ListItem>
                    );
                })}
            </List>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Upload: {selectedDocType}</DialogTitle>
                <DialogContent>
                    <Box sx={{ p: 2, minWidth: 400 }}>
                        <Button variant="contained" component="label" fullWidth>
                            Choose File
                            <input type="file" hidden onChange={handleFileChange} />
                        </Button>
                        {selectedFile && <Typography sx={{ mt: 2 }}>Selected: {selectedFile.name}</Typography>}
                        {message && <Typography color={message.includes('success') ? 'success.main' : 'error.main'} sx={{ mt: 2 }}>{message}</Typography>}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleUpload} variant="contained" disabled={uploading || !selectedFile}>
                        {uploading ? <CircularProgress size={24} /> : 'Upload'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DocumentCenter;
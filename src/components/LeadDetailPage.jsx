import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import {
  Container,
  Box,
  Typography,
  AppBar,
  Toolbar,
} from "@mui/material";

import { ThemeProvider, createTheme } from "@mui/material/styles";

import LeadForm from "./LeadForm";
import BankLeadForm from "./BankLeadForm";
import logo from "./logo.jpeg";

/* --- Custom Theme with Logo Colors --- */
const theme = createTheme({
  palette: {
    primary: {
      main: "#ec4c23", // Orange
    },
    secondary: {
      main: "#4f2b68", // Purple
    },
  },
});

const LeadDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [userRole, setUserRole] = React.useState("");

  React.useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("employeeUser"));
    if (storedUser) {
      setUserRole(storedUser.role);
    }
  }, []);

  /* --- After Update Redirect --- */
  const handleUpdate = () => {
    navigate("/");
  };

  /* --- Read Only Mode --- */
  const isReadOnly = location.pathname.endsWith("/view");

  return (
    <ThemeProvider theme={theme}>
      <>
        {/* --- TOP HEADER BAR --- */}
        <AppBar position="static" color="secondary">
          <Toolbar>
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{ height: 35, mr: 2 }}
            />

            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {id
                ? isReadOnly
                  ? "View Lead Details"
                  : "Edit Lead"
                : "Create New Lead"}
            </Typography>
          </Toolbar>
        </AppBar>

        {/* --- FORM SECTION --- */}
        <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
          {userRole === "BankExecutive" ? (
            <BankLeadForm
              leadData={{ _id: id }}
              onUpdate={handleUpdate}
              onBack={() => navigate(-1)}
              isReadOnly={isReadOnly}
            />
          ) : (
            <LeadForm
              leadData={{ _id: id }}
              isReadOnly={isReadOnly}
              onUpdate={handleUpdate}
              onBack={() => navigate(-1)}
            />
          )}
        </Container>
      </>
    </ThemeProvider>
  );
};

export default LeadDetailPage;

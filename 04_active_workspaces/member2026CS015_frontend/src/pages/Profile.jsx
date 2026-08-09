import { useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  TextField,
  Grid,
  Chip,
  Divider,
  Alert,
} from "@mui/material";

import {
  Person,
  Edit,
  Save,
  Agriculture,
  Phone,
  Email,
  LocationOn,
  Pets,
  CameraAlt,
  Badge,
} from "@mui/icons-material";


export default function Profile() {

  const [editing, setEditing] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const [profile, setProfile] =
    useState({
      name: "Farm Administrator",
      email: "admin@gmail.com",
      phone: "+91 98765 43210",
      location: "Pune, Maharashtra",
      farmName: "Green Valley Farm",
      role: "Farm Administrator",
    });


  const handleChange = (e) => {

    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });

    setSaved(false);
  };


  const handleSave = () => {

    setEditing(false);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };


  const handleCancel = () => {

    setEditing(false);

  };


  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f8ff",
        p: {
          xs: 2,
          sm: 3,
          md: 4,
        },
      }}
    >

      {/* =========================================
          PAGE HEADER
      ========================================== */}

      <Box
        sx={{
          mb: 4,
        }}
      >

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >

          <Avatar
            sx={{
              width: 52,
              height: 52,
              backgroundColor: "#dbeafe",
              color: "#2563eb",
            }}
          >
            <Person />
          </Avatar>

          <Box>

            <Typography
              variant="h4"
              fontWeight={900}
              color="#172554"
            >
              My Profile 👤
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 0.5,
              }}
            >
              Manage your AgroLens PLF
              personal and farm information.
            </Typography>

          </Box>

        </Box>

      </Box>


      {/* =========================================
          SUCCESS MESSAGE
      ========================================== */}

      {saved && (

        <Alert
          severity="success"
          sx={{
            mb: 3,
            borderRadius: 3,
            fontWeight: 700,
          }}
        >
          Profile updated successfully.
        </Alert>

      )}


      <Grid
        container
        spacing={3}
      >

        {/* =========================================
            LEFT PROFILE CARD
        ========================================== */}

        <Grid
          item
          xs={12}
          md={4}
        >

          <Card
            sx={{
              borderRadius: 4,
              boxShadow: "none",
              border:
                "1px solid #e5e7eb",
            }}
          >

            <CardContent
              sx={{
                textAlign: "center",
                p: 4,
              }}
            >

              {/* AVATAR */}

              <Box
                sx={{
                  position: "relative",
                  width: 115,
                  margin: "auto",
                }}
              >

                <Avatar
                  sx={{
                    width: 115,
                    height: 115,
                    background:
                      "linear-gradient(135deg, #16a34a, #22c55e)",
                    fontSize: 42,
                    fontWeight: 900,
                    boxShadow:
                      "0 10px 25px rgba(22,163,74,0.25)",
                  }}
                >
                  {profile.name
                    .charAt(0)
                    .toUpperCase()}
                </Avatar>


                <IconButton
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    backgroundColor:
                      "#ffffff",
                    boxShadow:
                      "0 3px 10px rgba(0,0,0,0.18)",
                    "&:hover": {
                      backgroundColor:
                        "#f8fafc",
                    },
                  }}
                >
                  <CameraAlt
                    fontSize="small"
                  />
                </IconButton>

              </Box>


              {/* NAME */}

              <Typography
                variant="h5"
                fontWeight={900}
                sx={{
                  mt: 3,
                }}
              >
                {profile.name}
              </Typography>


              <Typography
                color="text.secondary"
                sx={{
                  mt: 0.5,
                }}
              >
                {profile.email}
              </Typography>


              <Chip
                icon={<Badge />}
                label={profile.role}
                color="success"
                sx={{
                  mt: 2,
                  fontWeight: 800,
                }}
              />


              <Divider
                sx={{
                  my: 3,
                }}
              />


              {/* PHONE */}

              <InfoRow
                icon={<Phone />}
                title="Phone"
                value={profile.phone}
              />


              {/* LOCATION */}

              <InfoRow
                icon={<LocationOn />}
                title="Location"
                value={profile.location}
              />


              {/* FARM */}

              <InfoRow
                icon={<Agriculture />}
                title="Farm"
                value={profile.farmName}
              />

            </CardContent>

          </Card>

        </Grid>


        {/* =========================================
            RIGHT INFORMATION CARD
        ========================================== */}

        <Grid
          item
          xs={12}
          md={8}
        >

          <Card
            sx={{
              borderRadius: 4,
              boxShadow: "none",
              border:
                "1px solid #e5e7eb",
            }}
          >

            <CardContent
              sx={{
                p: {
                  xs: 2.5,
                  sm: 4,
                },
              }}
            >

              {/* INFORMATION HEADER */}

              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  gap: 2,
                  mb: 3,
                }}
              >

                <Box>

                  <Typography
                    variant="h6"
                    fontWeight={900}
                  >
                    Personal Information
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Your AgroLens account
                    information.
                  </Typography>

                </Box>


                {!editing && (

                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={() =>
                      setEditing(true)
                    }
                    sx={{
                      borderRadius: 2.5,
                      textTransform:
                        "none",
                      fontWeight: 800,
                    }}
                  >
                    Edit
                  </Button>

                )}

              </Box>


              {/* PERSONAL FIELDS */}

              <Grid
                container
                spacing={2}
              >

                <Grid
                  item
                  xs={12}
                  sm={6}
                >

                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={profile.name}
                    onChange={
                      handleChange
                    }
                    disabled={!editing}
                  />

                </Grid>


                <Grid
                  item
                  xs={12}
                  sm={6}
                >

                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    value={profile.email}
                    disabled
                    InputProps={{
                      startAdornment: (
                        <Email
                          sx={{
                            mr: 1,
                            color:
                              "#64748b",
                          }}
                        />
                      ),
                    }}
                  />

                </Grid>


                <Grid
                  item
                  xs={12}
                  sm={6}
                >

                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={profile.phone}
                    onChange={
                      handleChange
                    }
                    disabled={!editing}
                  />

                </Grid>


                <Grid
                  item
                  xs={12}
                  sm={6}
                >

                  <TextField
                    fullWidth
                    label="Location"
                    name="location"
                    value={
                      profile.location
                    }
                    onChange={
                      handleChange
                    }
                    disabled={!editing}
                  />

                </Grid>

              </Grid>


              <Divider
                sx={{
                  my: 4,
                }}
              />


              {/* FARM INFORMATION */}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 3,
                }}
              >

                <Avatar
                  sx={{
                    backgroundColor:
                      "#dcfce7",
                    color: "#16a34a",
                  }}
                >
                  <Agriculture />
                </Avatar>

                <Box>

                  <Typography
                    variant="h6"
                    fontWeight={900}
                  >
                    Farm Information
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Your primary farm
                    details.
                  </Typography>

                </Box>

              </Box>


              <TextField
                fullWidth
                label="Farm Name"
                name="farmName"
                value={
                  profile.farmName
                }
                onChange={
                  handleChange
                }
                disabled={!editing}
              />


              {/* FARM TAGS */}

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  mt: 3,
                  flexWrap: "wrap",
                }}
              >

                <Chip
                  icon={<Pets />}
                  label="Livestock Management"
                  color="success"
                  sx={{
                    fontWeight: 800,
                  }}
                />

                <Chip
                  icon={<Agriculture />}
                  label="Precision Farming"
                  color="primary"
                  sx={{
                    fontWeight: 800,
                  }}
                />

              </Box>


              {/* EDIT BUTTONS */}

              {editing && (

                <Box
                  sx={{
                    display: "flex",
                    justifyContent:
                      "flex-end",
                    gap: 1.5,
                    mt: 4,
                  }}
                >

                  <Button
                    onClick={
                      handleCancel
                    }
                    sx={{
                      fontWeight: 800,
                    }}
                  >
                    Cancel
                  </Button>


                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={
                      handleSave
                    }
                    sx={{
                      borderRadius: 2.5,
                      fontWeight: 800,
                      backgroundColor:
                        "#16a34a",
                      "&:hover": {
                        backgroundColor:
                          "#15803d",
                      },
                    }}
                  >
                    Save Profile
                  </Button>

                </Box>

              )}

            </CardContent>

          </Card>

        </Grid>


        {/* =========================================
            PROFILE SUMMARY
        ========================================== */}

        <Grid
          item
          xs={12}
        >

          <Card
            sx={{
              borderRadius: 4,
              boxShadow: "none",
              border:
                "1px solid #e5e7eb",
            }}
          >

            <CardContent
              sx={{
                p: 3,
              }}
            >

              <Typography
                variant="h6"
                fontWeight={900}
                sx={{
                  mb: 2,
                }}
              >
                AgroLens PLF Membership
              </Typography>


              <Grid
                container
                spacing={2}
              >

                <SummaryBox
                  icon="🌾"
                  title="Farm Management"
                  value="Active"
                />

                <SummaryBox
                  icon="🐄"
                  title="Livestock Monitoring"
                  value="Enabled"
                />

                <SummaryBox
                  icon="🤖"
                  title="AI Monitoring"
                  value="Enabled"
                />

                <SummaryBox
                  icon="📡"
                  title="IoT Connectivity"
                  value="Connected"
                />

              </Grid>

            </CardContent>

          </Card>

        </Grid>

      </Grid>

    </Box>
  );
}


/* =====================================================
   INFO ROW
===================================================== */

function InfoRow({
  icon,
  title,
  value,
}) {

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        textAlign: "left",
        mb: 2.5,
      }}
    >

      <Avatar
        sx={{
          width: 40,
          height: 40,
          backgroundColor:
            "#f0fdf4",
          color: "#16a34a",
        }}
      >
        {icon}
      </Avatar>

      <Box>

        <Typography
          variant="caption"
          color="text.secondary"
        >
          {title}
        </Typography>

        <Typography
          fontWeight={700}
        >
          {value}
        </Typography>

      </Box>

    </Box>
  );
}


/* =====================================================
   SUMMARY BOX
===================================================== */

function SummaryBox({
  icon,
  title,
  value,
}) {

  return (
    <Grid
      item
      xs={12}
      sm={6}
      md={3}
    >

      <Box
        sx={{
          p: 2,
          borderRadius: 3,
          backgroundColor:
            "#f8fafc",
          border:
            "1px solid #e2e8f0",
        }}
      >

        <Typography
          sx={{
            fontSize: 28,
          }}
        >
          {icon}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 1,
          }}
        >
          {title}
        </Typography>

        <Typography
          fontWeight={900}
          sx={{
            mt: 0.5,
          }}
        >
          {value}
        </Typography>

      </Box>

    </Grid>
  );
}
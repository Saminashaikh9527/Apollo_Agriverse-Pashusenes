import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Tabs,
  Tab,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

function DigitalTwin() {
  const [tab, setTab] = useState(0);

  const animal = {
    id: "Cow001",
    tag: "AGRO-001",
    species: "Cow",
    breed: "Holstein",
    age: "4 Years",
    gender: "Female",
    weight: "420 kg",
    farm: "Farm A",
    health: "Healthy",
    behaviour: "Eating",
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Box sx={{ padding: 3 }}>

      {/* Page Title */}
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Animal Digital Twin
      </Typography>

      <Typography variant="body1" color="text.secondary" mb={3}>
        Complete digital profile and history of the animal
      </Typography>

      {/* Animal Profile */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">

            <Grid item xs={12} md={3}>
              <Box
                sx={{
                  width: 130,
                  height: 130,
                  borderRadius: "50%",
                  backgroundColor: "#e8f5e9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 65,
                  margin: "auto",
                }}
              >
                🐄
              </Box>
            </Grid>

            <Grid item xs={12} md={9}>
              <Typography variant="h5" fontWeight="bold">
                {animal.id}
              </Typography>

              <Typography color="text.secondary" mb={2}>
                Tag Number: {animal.tag}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Typography variant="caption">
                    Species
                  </Typography>
                  <Typography fontWeight="bold">
                    {animal.species}
                  </Typography>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Typography variant="caption">
                    Breed
                  </Typography>
                  <Typography fontWeight="bold">
                    {animal.breed}
                  </Typography>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Typography variant="caption">
                    Age
                  </Typography>
                  <Typography fontWeight="bold">
                    {animal.age}
                  </Typography>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Typography variant="caption">
                    Weight
                  </Typography>
                  <Typography fontWeight="bold">
                    {animal.weight}
                  </Typography>
                </Grid>
              </Grid>

              <Box mt={2}>
                <Chip
                  label={`Health: ${animal.health}`}
                  color="success"
                  sx={{ mr: 1 }}
                />

                <Chip
                  label={`Behaviour: ${animal.behaviour}`}
                  color="primary"
                />
              </Box>
            </Grid>

          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Overview" />
          <Tab label="Health" />
          <Tab label="Production" />
          <Tab label="Behaviour" />
          <Tab label="Feed" />
          <Tab label="Predictions" />
          <Tab label="Timeline" />
        </Tabs>

        <Divider />

        <CardContent>

          {/* Overview */}
          {tab === 0 && (
            <Box>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Animal Overview
              </Typography>

              <Grid container spacing={3}>

                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="text.secondary">
                        Farm
                      </Typography>
                      <Typography variant="h6">
                        {animal.farm}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="text.secondary">
                        Current Health
                      </Typography>
                      <Typography variant="h6">
                        Healthy
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="text.secondary">
                        Current Behaviour
                      </Typography>
                      <Typography variant="h6">
                        Eating
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

              </Grid>
            </Box>
          )}

          {/* Health */}
          {tab === 1 && (
            <Box>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Health Information
              </Typography>

              <Grid container spacing={3}>

                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="text.secondary">
                        Health Status
                      </Typography>
                      <Typography variant="h6">
                        Healthy
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="text.secondary">
                        Temperature
                      </Typography>
                      <Typography variant="h6">
                        38.5 °C
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="text.secondary">
                        Heart Rate
                      </Typography>
                      <Typography variant="h6">
                        72 bpm
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

              </Grid>

              <Typography variant="h6" mt={4} mb={1}>
                Health History
              </Typography>

              <List>
                <ListItem>
                  <ListItemText
                    primary="07 Aug 2026"
                    secondary="Healthy"
                  />
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="05 Aug 2026"
                    secondary="Minor health risk detected"
                  />
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="01 Aug 2026"
                    secondary="Healthy"
                  />
                </ListItem>
              </List>
            </Box>
          )}

          {/* Production */}
          {tab === 2 && (
            <Box>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Production History
              </Typography>

              <Grid container spacing={3}>

                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="text.secondary">
                        Today's Milk
                      </Typography>
                      <Typography variant="h5">
                        12 L
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="text.secondary">
                        Weekly Production
                      </Typography>
                      <Typography variant="h5">
                        78 L
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="text.secondary">
                        Monthly Production
                      </Typography>
                      <Typography variant="h5">
                        320 L
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

              </Grid>
            </Box>
          )}

          {/* Behaviour */}
          {tab === 3 && (
            <Box>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                AI Behaviour Monitoring
              </Typography>

              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h5">
                    🟢 Eating
                  </Typography>

                  <Typography mt={1}>
                    Confidence: 96%
                  </Typography>

                  <Typography color="text.secondary" mt={1}>
                    Last detected: 07 Aug 2026, 10:45 AM
                  </Typography>
                </CardContent>
              </Card>

              <Typography variant="h6" mt={4}>
                Behaviour History
              </Typography>

              <List>
                <ListItem>
                  <ListItemText
                    primary="10:45 AM"
                    secondary="Eating"
                  />
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="09:30 AM"
                    secondary="Walking"
                  />
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="08:15 AM"
                    secondary="Drinking"
                  />
                </ListItem>
              </List>
            </Box>
          )}

          {/* Feed */}
          {tab === 4 && (
            <Box>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Feed Records
              </Typography>

              <List>
                <ListItem>
                  <ListItemText
                    primary="Green Fodder"
                    secondary="8 kg"
                  />
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="Dry Fodder"
                    secondary="4 kg"
                  />
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="Concentrate"
                    secondary="2 kg"
                  />
                </ListItem>
              </List>

              <Typography variant="h6" mt={2}>
                Total Feed: 14 kg
              </Typography>
            </Box>
          )}

          {/* Predictions */}
          {tab === 5 && (
            <Box>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                ML Predictions
              </Typography>

              <Grid container spacing={3}>

                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="text.secondary">
                        Tomorrow's Milk Prediction
                      </Typography>
                      <Typography variant="h5">
                        12.8 L
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="text.secondary">
                        Health Risk
                      </Typography>
                      <Typography variant="h5">
                        Low Risk
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="text.secondary">
                        Recommendation
                      </Typography>
                      <Typography>
                        Increase protein-rich feed
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

              </Grid>
            </Box>
          )}

          {/* Timeline */}
          {tab === 6 && (
            <Box>
              <Typography variant="h6" fontWeight="bold" mb={3}>
                Animal Timeline
              </Typography>

              <List>

                <ListItem>
                  <ListItemText
                    primary="07 Aug 2026 — Health Alert"
                    secondary="Health monitoring completed"
                  />
                </ListItem>

                <Divider />

                <ListItem>
                  <ListItemText
                    primary="06 Aug 2026 — Milk Production"
                    secondary="12 L milk recorded"
                  />
                </ListItem>

                <Divider />

                <ListItem>
                  <ListItemText
                    primary="05 Aug 2026 — Vaccination"
                    secondary="Vaccination completed"
                  />
                </ListItem>

                <Divider />

                <ListItem>
                  <ListItemText
                    primary="04 Aug 2026 — AI Behaviour"
                    secondary="Eating detected with 96% confidence"
                  />
                </ListItem>

                <Divider />

                <ListItem>
                  <ListItemText
                    primary="03 Aug 2026 — Weight Update"
                    secondary="Animal weight updated to 420 kg"
                  />
                </ListItem>

                <Divider />

                <ListItem>
                  <ListItemText
                    primary="01 Aug 2026 — Animal Registered"
                    secondary="Cow001 registered in Farm A"
                  />
                </ListItem>

              </List>
            </Box>
          )}

        </CardContent>
      </Card>

    </Box>
  );
}

export default DigitalTwin;
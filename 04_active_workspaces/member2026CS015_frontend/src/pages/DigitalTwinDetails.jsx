import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Button,
  Divider
} from "@mui/material";

import {
  ArrowBack,
  Favorite,
  Thermostat,
  DirectionsRun,
  Restaurant,
  LocalDrink,
  Vaccines,
  Psychology,
  TrendingUp,
  MonitorHeart
} from "@mui/icons-material";


const animals = [
  {
    id: "COW001",
    name: "COW001",
    species: "Cow",
    breed: "Holstein Friesian",
    age: 4,
    weight: 420,
    healthScore: 92,
    healthStatus: "Healthy",
    activity: "Normal",
    temperature: 38.5,
    milkProduction: 8.5,
    feedIntake: 12,
    diseaseRisk: 8,
    vaccination: "15 Aug 2026",
    pregnancy: "Pregnant",
    image: "🐄"
  },

  {
    id: "BUF001",
    name: "BUF001",
    species: "Buffalo",
    breed: "Murrah",
    age: 5,
    weight: 510,
    healthScore: 87,
    healthStatus: "Healthy",
    activity: "Normal",
    temperature: 38.2,
    milkProduction: 7.2,
    feedIntake: 14,
    diseaseRisk: 12,
    vaccination: "20 Aug 2026",
    pregnancy: "Not Pregnant",
    image: "🐃"
  },

  {
    id: "GOAT001",
    name: "GOAT001",
    species: "Goat",
    breed: "Osmanabadi",
    age: 2,
    weight: 42,
    healthScore: 95,
    healthStatus: "Healthy",
    activity: "Active",
    temperature: 39.1,
    milkProduction: 1.8,
    feedIntake: 2.5,
    diseaseRisk: 5,
    vaccination: "10 Sep 2026",
    pregnancy: "Not Pregnant",
    image: "🐐"
  },

  {
    id: "SHEEP001",
    name: "SHEEP001",
    species: "Sheep",
    breed: "Deccani",
    age: 3,
    weight: 58,
    healthScore: 71,
    healthStatus: "Attention",
    activity: "Low",
    temperature: 40.1,
    milkProduction: 0,
    feedIntake: 1.8,
    diseaseRisk: 29,
    vaccination: "12 Aug 2026",
    pregnancy: "Not Pregnant",
    image: "🐑"
  },

  {
    id: "HEN001",
    name: "HEN001",
    species: "Chicken",
    breed: "Rhode Island Red",
    age: 1,
    weight: 2.1,
    healthScore: 96,
    healthStatus: "Healthy",
    activity: "Active",
    temperature: 41.2,
    milkProduction: 0,
    feedIntake: 0.12,
    diseaseRisk: 4,
    vaccination: "25 Aug 2026",
    pregnancy: "N/A",
    image: "🐔"
  }
];


function DigitalTwinDetails() {

  const { animalId } = useParams();

  const navigate = useNavigate();

  const animal = animals.find(
    (item) => item.id === animalId
  );


  if (!animal) {

    return (
      <Box sx={{ p: 4 }}>

        <Typography
          variant="h4"
          fontWeight={800}
        >
          Animal Not Found
        </Typography>

        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/digital-twin")}
          sx={{ mt: 2 }}
        >
          Back to Digital Twins
        </Button>

      </Box>
    );
  }


  const healthColor =
    animal.healthScore >= 80
      ? "success"
      : "warning";


  const riskColor =
    animal.diseaseRisk < 15
      ? "success"
      : "warning";


  return (

    <Box
      sx={{
        p: {
          xs: 2,
          md: 4
        },

        backgroundColor: "#f8fafc",

        minHeight: "100%"
      }}
    >

      {/* ==============================
          BACK BUTTON
      =============================== */}

      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate("/digital-twin")}
        sx={{
          mb: 2,
          textTransform: "none",
          fontWeight: 600
        }}
      >
        Back to Digital Twins
      </Button>


      {/* ==============================
          ANIMAL HEADER
      =============================== */}

      <Card
        sx={{
          borderRadius: 4,
          mb: 3,
          overflow: "hidden"
        }}
      >

        <CardContent sx={{ p: { xs: 2, md: 4 } }}>

          <Grid
            container
            spacing={3}
            alignItems="center"
          >

            {/* Animal Image */}

            <Grid
              item
              xs={12}
              md={3}
            >

              <Box
                sx={{
                  height: 200,

                  display: "flex",

                  justifyContent: "center",

                  alignItems: "center",

                  background:
                    "linear-gradient(135deg, #ecfdf5, #d1fae5)",

                  borderRadius: 4
                }}
              >

                <Typography
                  sx={{
                    fontSize: {
                      xs: 90,
                      md: 120
                    }
                  }}
                >
                  {animal.image}
                </Typography>

              </Box>

            </Grid>


            {/* Animal Information */}

            <Grid
              item
              xs={12}
              md={9}
            >

              <Box
                sx={{
                  display: "flex",

                  alignItems: "center",

                  gap: 2,

                  flexWrap: "wrap"
                }}
              >

                <Typography
                  variant="h3"
                  fontWeight={800}
                >
                  {animal.name}
                </Typography>


                <Chip
                  label={animal.healthStatus}
                  color={healthColor}
                  sx={{
                    fontWeight: 700
                  }}
                />

              </Box>


              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                {animal.species} • {animal.breed}
              </Typography>


              <Grid
                container
                spacing={3}
                sx={{ mt: 2 }}
              >

                <Grid item xs={6} sm={3}>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Age
                  </Typography>

                  <Typography
                    fontWeight={700}
                    fontSize={18}
                  >
                    {animal.age} years
                  </Typography>

                </Grid>


                <Grid item xs={6} sm={3}>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Weight
                  </Typography>

                  <Typography
                    fontWeight={700}
                    fontSize={18}
                  >
                    {animal.weight} kg
                  </Typography>

                </Grid>


                <Grid item xs={6} sm={3}>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Activity
                  </Typography>

                  <Typography
                    fontWeight={700}
                    fontSize={18}
                  >
                    {animal.activity}
                  </Typography>

                </Grid>


                <Grid item xs={6} sm={3}>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Pregnancy
                  </Typography>

                  <Typography
                    fontWeight={700}
                    fontSize={18}
                  >
                    {animal.pregnancy}
                  </Typography>

                </Grid>

              </Grid>

            </Grid>

          </Grid>

        </CardContent>

      </Card>


      {/* ==============================
          HEALTH + AI
      =============================== */}

      <Grid
        container
        spacing={3}
      >

        {/* Health Score */}

        <Grid
          item
          xs={12}
          md={6}
        >

          <Card
            sx={{
              borderRadius: 4,
              height: "100%"
            }}
          >

            <CardContent sx={{ p: 3 }}>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1
                }}
              >

                <Favorite color="error" />

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  Health Score
                </Typography>

              </Box>


              <Typography
                variant="h2"
                fontWeight={800}
                sx={{ mt: 2 }}
              >
                {animal.healthScore}%
              </Typography>


              <LinearProgress
                variant="determinate"
                value={animal.healthScore}
                color={healthColor}
                sx={{
                  mt: 2,
                  height: 10,
                  borderRadius: 5
                }}
              />


              <Typography
                color="text.secondary"
                sx={{ mt: 2 }}
              >
                Current health condition based on
                available animal data.
              </Typography>

            </CardContent>

          </Card>

        </Grid>


        {/* AI Prediction */}

        <Grid
          item
          xs={12}
          md={6}
        >

          <Card
            sx={{
              borderRadius: 4,
              height: "100%"
            }}
          >

            <CardContent sx={{ p: 3 }}>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1
                }}
              >

                <Psychology color="primary" />

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  AI Prediction
                </Typography>

              </Box>


              <Typography
                color="text.secondary"
                sx={{ mt: 2 }}
              >
                Disease Risk
              </Typography>


              <Typography
                variant="h3"
                fontWeight={800}
              >
                {animal.diseaseRisk}%
              </Typography>


              <Chip
                label={
                  animal.diseaseRisk < 15
                    ? "Low Risk"
                    : "Needs Attention"
                }
                color={riskColor}
                sx={{
                  mt: 1,
                  fontWeight: 600
                }}
              />


              <Typography
                color="text.secondary"
                sx={{ mt: 2 }}
              >
                AI prediction will become dynamic
                when the ML model is connected.
              </Typography>

            </CardContent>

          </Card>

        </Grid>


        {/* ==============================
            LIVE STATUS
        =============================== */}

        <Grid
          item
          xs={12}
        >

          <Card
            sx={{
              borderRadius: 4
            }}
          >

            <CardContent sx={{ p: 3 }}>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 3
                }}
              >

                <MonitorHeart color="success" />

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  Live Animal Status
                </Typography>

              </Box>


              <Grid
                container
                spacing={3}
              >

                {/* Temperature */}

                <Grid
                  item
                  xs={6}
                  md={3}
                >

                  <Thermostat color="error" />

                  <Typography
                    color="text.secondary"
                  >
                    Temperature
                  </Typography>

                  <Typography
                    variant="h6"
                    fontWeight={700}
                  >
                    {animal.temperature} °C
                  </Typography>

                </Grid>


                {/* Activity */}

                <Grid
                  item
                  xs={6}
                  md={3}
                >

                  <DirectionsRun color="primary" />

                  <Typography
                    color="text.secondary"
                  >
                    Activity
                  </Typography>

                  <Typography
                    variant="h6"
                    fontWeight={700}
                  >
                    {animal.activity}
                  </Typography>

                </Grid>


                {/* Feed */}

                <Grid
                  item
                  xs={6}
                  md={3}
                >

                  <Restaurant color="warning" />

                  <Typography
                    color="text.secondary"
                  >
                    Feed Intake
                  </Typography>

                  <Typography
                    variant="h6"
                    fontWeight={700}
                  >
                    {animal.feedIntake} kg/day
                  </Typography>

                </Grid>


                {/* Weight */}

                <Grid
                  item
                  xs={6}
                  md={3}
                >

                  <TrendingUp color="success" />

                  <Typography
                    color="text.secondary"
                  >
                    Weight
                  </Typography>

                  <Typography
                    variant="h6"
                    fontWeight={700}
                  >
                    {animal.weight} kg
                  </Typography>

                </Grid>

              </Grid>

            </CardContent>

          </Card>

        </Grid>


        {/* ==============================
            PRODUCTION
        =============================== */}

        <Grid
          item
          xs={12}
          md={6}
        >

          <Card
            sx={{
              borderRadius: 4,
              height: "100%"
            }}
          >

            <CardContent sx={{ p: 3 }}>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1
                }}
              >

                <LocalDrink color="primary" />

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  Production
                </Typography>

              </Box>


              <Typography
                variant="h3"
                fontWeight={800}
                sx={{ mt: 2 }}
              >
                {animal.milkProduction || 0} L
              </Typography>


              <Typography color="text.secondary">
                Daily milk production
              </Typography>

            </CardContent>

          </Card>

        </Grid>


        {/* ==============================
            VACCINATION
        =============================== */}

        <Grid
          item
          xs={12}
          md={6}
        >

          <Card
            sx={{
              borderRadius: 4,
              height: "100%"
            }}
          >

            <CardContent sx={{ p: 3 }}>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1
                }}
              >

                <Vaccines color="success" />

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  Vaccination
                </Typography>

              </Box>


              <Typography
                color="text.secondary"
                sx={{ mt: 2 }}
              >
                Next vaccination
              </Typography>


              <Typography
                variant="h6"
                fontWeight={700}
              >
                {animal.vaccination}
              </Typography>

            </CardContent>

          </Card>

        </Grid>


        {/* ==============================
            DIGITAL TWIN TIMELINE
        =============================== */}

        <Grid
          item
          xs={12}
        >

          <Card
            sx={{
              borderRadius: 4
            }}
          >

            <CardContent sx={{ p: 3 }}>

              <Typography
                variant="h6"
                fontWeight={700}
                sx={{ mb: 3 }}
              >
                Digital Twin Timeline
              </Typography>


              <Box>

                <Box sx={{ mb: 3 }}>

                  <Typography fontWeight={700}>
                    Today
                  </Typography>

                  <Typography color="text.secondary">
                    🟢 Health status checked — Normal
                  </Typography>

                </Box>


                <Divider sx={{ mb: 3 }} />


                <Box sx={{ mb: 3 }}>

                  <Typography fontWeight={700}>
                    Yesterday
                  </Typography>

                  <Typography color="text.secondary">
                    📊 Activity remained stable
                  </Typography>

                </Box>


                <Divider sx={{ mb: 3 }} />


                <Box sx={{ mb: 3 }}>

                  <Typography fontWeight={700}>
                    2 days ago
                  </Typography>

                  <Typography color="text.secondary">
                    🤖 AI health analysis completed
                  </Typography>

                </Box>


                <Divider sx={{ mb: 3 }} />


                <Box>

                  <Typography fontWeight={700}>
                    5 days ago
                  </Typography>

                  <Typography color="text.secondary">
                    ⚖ Weight recorded: {animal.weight} kg
                  </Typography>

                </Box>

              </Box>

            </CardContent>

          </Card>

        </Grid>

      </Grid>

    </Box>
  );
}

export default DigitalTwinDetails;
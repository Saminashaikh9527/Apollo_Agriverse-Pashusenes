import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  LinearProgress
} from "@mui/material";

import {
  Favorite,
  MonitorHeart,
  ArrowForward
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

export default function DigitalTwinCard({ animal }) {
  const navigate = useNavigate();

  const statusColor =
    animal.healthStatus === "Healthy"
      ? "success"
      : animal.healthStatus === "Attention"
      ? "warning"
      : "error";

  return (
    <Card
      sx={{
        borderRadius: 4,
        height: "100%",
        transition: "0.3s",
        border: "1px solid #e5e7eb",

        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 12px 30px rgba(0,0,0,0.10)"
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >

          <Typography fontSize={50}>
            {animal.image}
          </Typography>

          <Chip
            label={animal.healthStatus}
            color={statusColor}
            size="small"
          />

        </Box>

        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ mt: 2 }}
        >
          {animal.name}
        </Typography>

        <Typography color="text.secondary">
          {animal.species} • {animal.breed}
        </Typography>

        <Box sx={{ mt: 3 }}>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between"
            }}
          >
            <Typography variant="body2">
              Health Score
            </Typography>

            <Typography
              variant="body2"
              fontWeight={700}
            >
              {animal.healthScore}%
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={animal.healthScore}
            color={statusColor}
            sx={{
              mt: 1,
              height: 8,
              borderRadius: 5
            }}
          />

        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 1.5,
            mt: 3
          }}
        >

          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Weight
            </Typography>

            <Typography fontWeight={600}>
              {animal.weight} kg
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Activity
            </Typography>

            <Typography fontWeight={600}>
              {animal.activity}
            </Typography>
          </Box>

        </Box>

        <Button
          fullWidth
          variant="outlined"
          endIcon={<ArrowForward />}
          sx={{
            mt: 3,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600
          }}
          onClick={() =>
            navigate(`/digital-twins/${animal.id}`)
          }
        >
          View Digital Twin
        </Button>

      </CardContent>
    </Card>
  );
}
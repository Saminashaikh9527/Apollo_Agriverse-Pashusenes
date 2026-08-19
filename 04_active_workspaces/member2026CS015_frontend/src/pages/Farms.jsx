import { useState, useEffect } from "react";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";

import {
  Agriculture,
  Add,
  Search,
  LocationOn,
  Pets,
  Grass,
  LocalDrink,
  Delete,
  Visibility,
  Sensors,
} from "@mui/icons-material";

import {
  getFarms as fetchFarms,
  createFarm,
  deleteFarm as deleteAPI,
} from "../api/farms";

import { getAnimals } from "../api/animals";
import { getMilkRecords } from "../api/milk";

export default function Farms() {
  const [farms, setFarms] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [milkRecords, setMilkRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newFarm, setNewFarm] = useState({
    farm_name: "",
    village: "",
    district: "",
    state: "",
    total_land: "",
  });

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [farmsData, animalsData, milkData] =
          await Promise.all([
            fetchFarms().catch((err) => {
              console.error("Farms API error:", err);
              return [];
            }),

            getAnimals().catch((err) => {
              console.error("Animals API error:", err);
              return [];
            }),

            getMilkRecords().catch((err) => {
              console.error("Milk API error:", err);
              return [];
            }),
          ]);

        console.log("Farms:", farmsData);
        console.log("Animals:", animalsData);
        console.log("Milk:", milkData);

        setFarms(
          Array.isArray(farmsData)
            ? farmsData
            : farmsData?.data || farmsData?.farms || []
        );

        setAnimals(
          Array.isArray(animalsData)
            ? animalsData
            : animalsData?.data || animalsData?.animals || []
        );

        setMilkRecords(
          Array.isArray(milkData)
            ? milkData
            : milkData?.data || milkData?.records || []
        );
      } catch (err) {
        console.error("Error loading farms:", err);
        setError("Failed to load farms data.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredFarms = farms.filter((farm) =>
    String(farm?.farm_name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // =====================================================
  // SUMMARY
  // =====================================================

  const totalAnimals = animals.length;

  const totalMilk = milkRecords.reduce(
    (sum, record) =>
      sum + (Number(record?.total_litres) || 0),
    0
  );

  const healthyFarms = farms.length;

  // =====================================================
  // ADD FARM
  // =====================================================

  const handleAddFarm = async () => {
    setError(null);

    if (!newFarm.farm_name.trim()) {
      setError("Farm name is required.");
      return;
    }

    if (!newFarm.village.trim()) {
      setError("Village is required.");
      return;
    }

    try {
      const farmData = {
        farm_name: newFarm.farm_name.trim(),
        village: newFarm.village.trim(),
        district: newFarm.district.trim(),
        state: newFarm.state.trim(),
        total_land: Number(newFarm.total_land) || 0,
      };

      console.log("Creating farm:", farmData);

      await createFarm(farmData);

      const updatedFarms = await fetchFarms();

      setFarms(
        Array.isArray(updatedFarms)
          ? updatedFarms
          : updatedFarms?.data || updatedFarms?.farms || []
      );

      setNewFarm({
        farm_name: "",
        village: "",
        district: "",
        state: "",
        total_land: "",
      });

      setOpen(false);
    } catch (err) {
      console.error("Error adding farm:", err);

      setError(
        err?.message ||
          "Failed to add farm. Please try again."
      );
    }
  };

  // =====================================================
  // DELETE FARM
  // =====================================================

  const handleDeleteFarm = async (farmId) => {
    if (!farmId) {
      setError("Invalid farm ID.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this farm?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError(null);

      await deleteAPI(farmId);

      setFarms((previous) =>
        previous.filter(
          (farm) => farm.farm_id !== farmId
        )
      );
    } catch (err) {
      console.error("Error deleting farm:", err);

      setError(
        err?.message || "Failed to delete farm."
      );
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f8ff",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // =====================================================
  // UI
  // =====================================================

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
      {/* ERROR */}

      {error && (
        <Alert
          severity="error"
          onClose={() => setError(null)}
          sx={{
            mb: 3,
            borderRadius: 3,
          }}
        >
          {error}
        </Alert>
      )}

      {/* =================================================
          HEADER
      ================================================== */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            md: "center",
          },
          flexWrap: "wrap",
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
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
                backgroundColor: "#dcfce7",
                color: "#16a34a",
              }}
            >
              <Agriculture />
            </Avatar>

            <Typography
              variant="h4"
              fontWeight={900}
              color="#172554"
            >
              My Farms 🌾
            </Typography>
          </Box>

          <Typography
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Manage farms, livestock, production and
            connected smart-farming devices.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setError(null);
            setOpen(true);
          }}
          sx={{
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 900,
            px: 3,
            py: 1.3,
            backgroundColor: "#16a34a",
            "&:hover": {
              backgroundColor: "#15803d",
            },
          }}
        >
          Add New Farm
        </Button>
      </Box>

      {/* =================================================
          SUMMARY
      ================================================== */}

      <Grid
        container
        spacing={2.5}
        sx={{ mb: 4 }}
      >
        <Summary
          title="Total Farms"
          value={farms.length}
          icon={<Agriculture />}
          color="#16a34a"
          background="#dcfce7"
        />

        <Summary
          title="Total Animals"
          value={totalAnimals}
          icon={<Pets />}
          color="#2563eb"
          background="#dbeafe"
        />

        <Summary
          title="Milk Production"
          value={`${totalMilk.toFixed(1)} L`}
          icon={<LocalDrink />}
          color="#0891b2"
          background="#cffafe"
        />

        <Summary
          title="Healthy Farms"
          value={healthyFarms}
          icon={<Grass />}
          color="#7c3aed"
          background="#ede9fe"
        />
      </Grid>

      {/* =================================================
          SEARCH
      ================================================== */}

      <Card
        sx={{
          mb: 3,
          borderRadius: 4,
          boxShadow: "none",
          border: "1px solid #e5e7eb",
        }}
      >
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search farms by name..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              },
            }}
          />
        </CardContent>
      </Card>

      {/* =================================================
          FARM CARDS
      ================================================== */}

      <Grid
        container
        spacing={3}
      >
        {filteredFarms.map((farm) => (
          <Grid
            key={farm.farm_id}
            size={{
              xs: 12,
              md: 6,
              lg: 4,
            }}
          >
            <FarmCard
              farm={farm}
              onView={() => setSelectedFarm(farm)}
              onDelete={() =>
                handleDeleteFarm(farm.farm_id)
              }
            />
          </Grid>
        ))}
      </Grid>

      {/* =================================================
          EMPTY STATE
      ================================================== */}

      {filteredFarms.length === 0 && (
        <Card
          sx={{
            mt: 3,
            borderRadius: 4,
            textAlign: "center",
            p: 5,
            boxShadow: "none",
            border: "1px solid #e5e7eb",
          }}
        >
          <Agriculture
            sx={{
              fontSize: 55,
              color: "#94a3b8",
            }}
          />

          <Typography
            variant="h6"
            fontWeight={900}
          >
            No farms found
          </Typography>

          <Typography color="text.secondary">
            Try another search or add a new farm.
          </Typography>
        </Card>
      )}

      {/* =================================================
          FARM DETAIL DIALOG
      ================================================== */}

      <Dialog
        open={Boolean(selectedFarm)}
        onClose={() => setSelectedFarm(null)}
        fullWidth
        maxWidth="sm"
      >
        {selectedFarm && (
          <>
            <DialogTitle
              sx={{
                fontWeight: 900,
              }}
            >
              {selectedFarm.farm_name}
            </DialogTitle>

            <DialogContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 3,
                }}
              >
                <LocationOn
                  sx={{
                    color: "#dc2626",
                  }}
                />

                <Typography>
                  {selectedFarm.village || "—"}
                  {selectedFarm.district
                    ? `, ${selectedFarm.district}`
                    : ""}
                  {selectedFarm.state
                    ? `, ${selectedFarm.state}`
                    : ""}
                </Typography>
              </Box>

              <Grid
                container
                spacing={2}
              >
                <Detail
                  label="Farm Area"
                  value={`${selectedFarm.total_land || 0} acres`}
                />

                <Detail
                  label="Village"
                  value={selectedFarm.village || "—"}
                />

                <Detail
                  label="District"
                  value={selectedFarm.district || "—"}
                />

                <Detail
                  label="State"
                  value={selectedFarm.state || "—"}
                />
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
                <Chip
                  icon={<Sensors />}
                  label="Farm Active"
                  color="success"
                />
              </Box>
            </DialogContent>

            <DialogActions>
              <Button
                onClick={() => setSelectedFarm(null)}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* =================================================
          ADD FARM DIALOG
      ================================================== */}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            fontWeight: 900,
          }}
        >
          Add New Farm 🌾
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="Farm Name"
            margin="normal"
            required
            value={newFarm.farm_name}
            onChange={(event) =>
              setNewFarm((previous) => ({
                ...previous,
                farm_name: event.target.value,
              }))
            }
          />

          <TextField
            fullWidth
            label="Village"
            margin="normal"
            required
            value={newFarm.village}
            onChange={(event) =>
              setNewFarm((previous) => ({
                ...previous,
                village: event.target.value,
              }))
            }
          />

          <TextField
            fullWidth
            label="District"
            margin="normal"
            value={newFarm.district}
            onChange={(event) =>
              setNewFarm((previous) => ({
                ...previous,
                district: event.target.value,
              }))
            }
          />

          <TextField
            fullWidth
            label="State"
            margin="normal"
            value={newFarm.state}
            onChange={(event) =>
              setNewFarm((previous) => ({
                ...previous,
                state: event.target.value,
              }))
            }
          />

          <TextField
            fullWidth
            label="Total Land (acres)"
            type="number"
            margin="normal"
            value={newFarm.total_land}
            onChange={(event) =>
              setNewFarm((previous) => ({
                ...previous,
                total_land: event.target.value,
              }))
            }
            slotProps={{
              htmlInput: {
                min: 0,
                step: 0.1,
              },
            }}
          />
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddFarm}
            sx={{
              borderRadius: 2.5,
              fontWeight: 800,
            }}
          >
            Add Farm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

/* =====================================================
   SUMMARY
===================================================== */

function Summary({
  title,
  value,
  icon,
  color,
  background,
}) {
  return (
    <Grid
      size={{
        xs: 12,
        sm: 6,
        md: 3,
      }}
    >
      <Card
        sx={{
          height: "100%",
          borderRadius: 4,
          boxShadow: "none",
          border: "1px solid #e5e7eb",
        }}
      >
        <CardContent>
          <Avatar
            sx={{
              backgroundColor: background,
              color,
              mb: 2,
            }}
          >
            {icon}
          </Avatar>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            {title}
          </Typography>

          <Typography
            variant="h5"
            fontWeight={900}
            sx={{ mt: 0.5 }}
          >
            {value}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}

/* =====================================================
   FARM CARD
===================================================== */

function FarmCard({
  farm,
  onView,
  onDelete,
}) {
  const farmName =
    farm?.farm_name || "Unknown Farm";

  const location = [
    farm?.village,
    farm?.district,
    farm?.state,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 4,
        boxShadow: "none",
        border: "1px solid #e5e7eb",
        overflow: "hidden",
      }}
    >
      {/* COLOR HEADER */}

      <Box
        sx={{
          height: 8,
          background:
            "linear-gradient(90deg, #16a34a, #22c55e, #84cc16)",
        }}
      />

      <CardContent sx={{ p: 3 }}>
        {/* FARM HEADER */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              minWidth: 0,
            }}
          >
            <Avatar
              sx={{
                width: 54,
                height: 54,
                flexShrink: 0,
                backgroundColor: "#dcfce7",
                color: "#16a34a",
              }}
            >
              <Agriculture />
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="h6"
                fontWeight={900}
                noWrap
              >
                {farmName}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  mt: 0.5,
                }}
              >
                <LocationOn
                  sx={{
                    fontSize: 17,
                    color: "#64748b",
                  }}
                />

                <Typography
                  variant="body2"
                  color="text.secondary"
                  noWrap
                >
                  {location || "Location not provided"}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Chip
            size="small"
            label="Active"
            color="success"
            sx={{
              fontWeight: 800,
              flexShrink: 0,
            }}
          />
        </Box>

        <Chip
          label="Mixed Livestock"
          size="small"
          sx={{
            mt: 2,
            backgroundColor: "#f1f5f9",
            fontWeight: 700,
          }}
        />

        <Divider sx={{ my: 2 }} />

        {/* FARM STATS */}

        <Grid
          container
          spacing={1.5}
          sx={{ mt: 1 }}
        >
          <Stat
            icon={<Grass />}
            label="Area"
            value={`${farm?.total_land || 0} acres`}
          />
        </Grid>

        {/* ACTIONS */}

        <Box
          sx={{
            display: "flex",
            gap: 1,
            mt: 2.5,
          }}
        >
          <Button
            fullWidth
            variant="contained"
            startIcon={<Visibility />}
            onClick={onView}
            sx={{
              borderRadius: 2.5,
              textTransform: "none",
              fontWeight: 800,
              backgroundColor: "#2563eb",
              "&:hover": {
                backgroundColor: "#1d4ed8",
              },
            }}
          >
            View Farm
          </Button>

          <Button
            variant="outlined"
            color="error"
            onClick={onDelete}
            sx={{
              minWidth: 48,
              borderRadius: 2.5,
            }}
          >
            <Delete />
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

/* =====================================================
   STAT
===================================================== */

function Stat({
  icon,
  label,
  value,
}) {
  return (
    <Grid
      size={{
        xs: 12,
        sm: 4,
      }}
    >
      <Box
        sx={{
          p: 1.5,
          borderRadius: 2.5,
          backgroundColor: "#f8fafc",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.7,
            color: "#64748b",
          }}
        >
          {icon}

          <Typography variant="caption">
            {label}
          </Typography>
        </Box>

        <Typography
          fontWeight={900}
          sx={{ mt: 0.5 }}
        >
          {value}
        </Typography>
      </Box>
    </Grid>
  );
}

/* =====================================================
   DETAIL
===================================================== */

function Detail({
  label,
  value,
}) {
  return (
    <Grid
      size={{
        xs: 6,
      }}
    >
      <Box
        sx={{
          p: 1.5,
          borderRadius: 2.5,
          backgroundColor: "#f8fafc",
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
        >
          {label}
        </Typography>

        <Typography
          fontWeight={900}
          sx={{ mt: 0.3 }}
        >
          {value}
        </Typography>
      </Box>
    </Grid>
  );
}
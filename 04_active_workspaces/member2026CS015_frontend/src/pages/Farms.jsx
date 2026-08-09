import { useState } from "react";

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
  MenuItem,
  Divider,
} from "@mui/material";

import {
  Agriculture,
  Add,
  Search,
  LocationOn,
  Pets,
  Grass,
  LocalDrink,
  Egg,
  Edit,
  Delete,
  Visibility,
  WaterDrop,
  Sensors,
} from "@mui/icons-material";


const initialFarms = [
  {
    id: 1,
    name: "Green Valley Farm",
    location: "Pune, Maharashtra",
    type: "Mixed Livestock",
    animals: 48,
    cows: 18,
    buffaloes: 8,
    goats: 12,
    sheep: 6,
    chickens: 4,
    milk: "126 L/day",
    status: "Healthy",
    area: "12 Acres",
  },

  {
    id: 2,
    name: "Shree Krishna Dairy",
    location: "Nashik, Maharashtra",
    type: "Dairy Farm",
    animals: 32,
    cows: 24,
    buffaloes: 8,
    goats: 0,
    sheep: 0,
    chickens: 0,
    milk: "182 L/day",
    status: "Healthy",
    area: "8 Acres",
  },

  {
    id: 3,
    name: "Sunrise Livestock Farm",
    location: "Satara, Maharashtra",
    type: "Livestock Farm",
    animals: 67,
    cows: 14,
    buffaloes: 10,
    goats: 25,
    sheep: 12,
    chickens: 6,
    milk: "94 L/day",
    status: "Attention",
    area: "18 Acres",
  },
];


export default function Farms() {

  const [farms, setFarms] =
    useState(initialFarms);

  const [search, setSearch] =
    useState("");

  const [open, setOpen] =
    useState(false);

  const [selectedFarm, setSelectedFarm] =
    useState(null);

  const [newFarm, setNewFarm] = useState({
    name: "",
    location: "",
    type: "Mixed Livestock",
    area: "",
  });


  const filteredFarms =
    farms.filter((farm) =>
      farm.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );


  const totalAnimals =
    farms.reduce(
      (sum, farm) =>
        sum + farm.animals,
      0
    );


  const totalMilk =
    farms.reduce(
      (sum, farm) =>
        sum +
        parseInt(
          farm.milk
            .replace(" L/day", "")
        ),
      0
    );


  const healthyFarms =
    farms.filter(
      (farm) =>
        farm.status === "Healthy"
    ).length;


  const attentionFarms =
    farms.filter(
      (farm) =>
        farm.status === "Attention"
    ).length;


  const handleAddFarm = () => {

    if (
      !newFarm.name ||
      !newFarm.location
    ) {
      return;
    }


    const farm = {
      id: Date.now(),
      name: newFarm.name,
      location: newFarm.location,
      type: newFarm.type,
      area: newFarm.area || "Not specified",
      animals: 0,
      cows: 0,
      buffaloes: 0,
      goats: 0,
      sheep: 0,
      chickens: 0,
      milk: "0 L/day",
      status: "Healthy",
    };


    setFarms([
      ...farms,
      farm,
    ]);


    setNewFarm({
      name: "",
      location: "",
      type: "Mixed Livestock",
      area: "",
    });


    setOpen(false);
  };


  const deleteFarm = (id) => {

    setFarms(
      farms.filter(
        (farm) =>
          farm.id !== id
      )
    );
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

      {/* =================================================
          HEADER
      ================================================== */}

      <Box
        sx={{
          display: "flex",
          justifyContent:
            "space-between",
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
                backgroundColor:
                  "#dcfce7",
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
            Manage farms, livestock,
            production and connected
            smart-farming devices.
          </Typography>

        </Box>


        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() =>
            setOpen(true)
          }
          sx={{
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 900,
            px: 3,
            py: 1.3,
            backgroundColor:
              "#16a34a",
            "&:hover": {
              backgroundColor:
                "#15803d",
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
          value={`${totalMilk} L`}
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
          border:
            "1px solid #e5e7eb",
        }}
      >

        <CardContent>

          <TextField
            fullWidth
            placeholder="Search farms by name..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
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

        {filteredFarms.map(
          (farm) => (

            <Grid
              item
              xs={12}
              md={6}
              lg={4}
              key={farm.id}
            >

              <FarmCard
                farm={farm}
                onView={() =>
                  setSelectedFarm(
                    farm
                  )
                }
                onDelete={() =>
                  deleteFarm(
                    farm.id
                  )
                }
              />

            </Grid>

          )
        )}

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

          <Typography
            color="text.secondary"
          >
            Try another search or add a
            new farm.
          </Typography>

        </Card>

      )}


      {/* =================================================
          FARM DETAIL DIALOG
      ================================================== */}

      <Dialog
        open={Boolean(selectedFarm)}
        onClose={() =>
          setSelectedFarm(null)
        }
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
              {selectedFarm.name}
            </DialogTitle>


            <DialogContent>

              <Box
                sx={{
                  display: "flex",
                  alignItems:
                    "center",
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
                  {selectedFarm.location}
                </Typography>

              </Box>


              <Grid
                container
                spacing={2}
              >

                <Detail
                  label="Farm Type"
                  value={
                    selectedFarm.type
                  }
                />

                <Detail
                  label="Area"
                  value={
                    selectedFarm.area
                  }
                />

                <Detail
                  label="Total Animals"
                  value={
                    selectedFarm.animals
                  }
                />

                <Detail
                  label="Milk Production"
                  value={
                    selectedFarm.milk
                  }
                />

                <Detail
                  label="Cows"
                  value={
                    selectedFarm.cows
                  }
                />

                <Detail
                  label="Buffaloes"
                  value={
                    selectedFarm.buffaloes
                  }
                />

                <Detail
                  label="Goats"
                  value={
                    selectedFarm.goats
                  }
                />

                <Detail
                  label="Sheep"
                  value={
                    selectedFarm.sheep
                  }
                />

                <Detail
                  label="Chickens"
                  value={
                    selectedFarm.chickens
                  }
                />

              </Grid>


              <Divider
                sx={{ my: 3 }}
              />


              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >

                <Chip
                  icon={<Sensors />}
                  label="IoT Connected"
                  color="success"
                />

                <Chip
                  icon={<Pets />}
                  label="AI Monitoring Active"
                  color="primary"
                />

              </Box>

            </DialogContent>


            <DialogActions>

              <Button
                onClick={() =>
                  setSelectedFarm(null)
                }
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
        onClose={() =>
          setOpen(false)
        }
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
            value={newFarm.name}
            onChange={(e) =>
              setNewFarm({
                ...newFarm,
                name: e.target.value,
              })
            }
          />


          <TextField
            fullWidth
            label="Location"
            margin="normal"
            value={newFarm.location}
            onChange={(e) =>
              setNewFarm({
                ...newFarm,
                location: e.target.value,
              })
            }
          />


          <TextField
            select
            fullWidth
            label="Farm Type"
            margin="normal"
            value={newFarm.type}
            onChange={(e) =>
              setNewFarm({
                ...newFarm,
                type: e.target.value,
              })
            }
          >

            <MenuItem value="Mixed Livestock">
              Mixed Livestock
            </MenuItem>

            <MenuItem value="Dairy Farm">
              Dairy Farm
            </MenuItem>

            <MenuItem value="Goat Farm">
              Goat Farm
            </MenuItem>

            <MenuItem value="Sheep Farm">
              Sheep Farm
            </MenuItem>

            <MenuItem value="Poultry Farm">
              Poultry Farm
            </MenuItem>

          </TextField>


          <TextField
            fullWidth
            label="Farm Area"
            placeholder="Example: 10 Acres"
            margin="normal"
            value={newFarm.area}
            onChange={(e) =>
              setNewFarm({
                ...newFarm,
                area: e.target.value,
              })
            }
          />

        </DialogContent>


        <DialogActions
          sx={{ p: 2 }}
        >

          <Button
            onClick={() =>
              setOpen(false)
            }
          >
            Cancel
          </Button>


          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={
              handleAddFarm
            }
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
      item
      xs={12}
      sm={6}
      md={3}
    >

      <Card
        sx={{
          borderRadius: 4,
          boxShadow: "none",
          border:
            "1px solid #e5e7eb",
        }}
      >

        <CardContent>

          <Avatar
            sx={{
              backgroundColor:
                background,
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

  const statusColor =
    farm.status === "Healthy"
      ? "success"
      : "warning";


  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "none",
        border:
          "1px solid #e5e7eb",
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
            justifyContent:
              "space-between",
            alignItems: "flex-start",
            gap: 2,
          }}
        >

          <Box
            sx={{
              display: "flex",
              gap: 1.5,
            }}
          >

            <Avatar
              sx={{
                width: 54,
                height: 54,
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
                {farm.name}
              </Typography>


              <Box
                sx={{
                  display: "flex",
                  alignItems:
                    "center",
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
                >
                  {farm.location}
                </Typography>

              </Box>

            </Box>

          </Box>


          <Chip
            size="small"
            label={farm.status}
            color={statusColor}
            sx={{
              fontWeight: 800,
            }}
          />

        </Box>


        <Chip
          label={farm.type}
          size="small"
          sx={{
            mt: 2,
            backgroundColor:
              "#f1f5f9",
            fontWeight: 700,
          }}
        />


        <Divider
          sx={{ my: 2 }}
        />


        {/* ANIMAL COUNTS */}

        <Typography
          variant="body2"
          fontWeight={800}
          sx={{ mb: 1.5 }}
        >
          Livestock
        </Typography>


        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
          }}
        >

          <AnimalChip
            emoji="🐄"
            label={farm.cows}
          />

          <AnimalChip
            emoji="🐃"
            label={farm.buffaloes}
          />

          <AnimalChip
            emoji="🐐"
            label={farm.goats}
          />

          <AnimalChip
            emoji="🐑"
            label={farm.sheep}
          />

          <AnimalChip
            emoji="🐔"
            label={farm.chickens}
          />

        </Box>


        {/* FARM STATS */}

        <Grid
          container
          spacing={1.5}
          sx={{ mt: 1 }}
        >

          <Stat
            icon={<Pets />}
            label="Animals"
            value={farm.animals}
          />

          <Stat
            icon={<LocalDrink />}
            label="Milk"
            value={farm.milk}
          />

          <Stat
            icon={<Grass />}
            label="Area"
            value={farm.area}
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
              backgroundColor:
                "#2563eb",
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
   ANIMAL CHIP
===================================================== */

function AnimalChip({
  emoji,
  label,
}) {

  return (
    <Chip
      label={`${emoji} ${label}`}
      sx={{
        backgroundColor:
          "#f8fafc",
        border:
          "1px solid #e2e8f0",
        fontWeight: 800,
      }}
    />
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
      item
      xs={12}
      sm={4}
    >

      <Box
        sx={{
          p: 1.5,
          borderRadius: 2.5,
          backgroundColor:
            "#f8fafc",
        }}
      >

        <Box
          sx={{
            display: "flex",
            alignItems:
              "center",
            gap: 0.7,
            color: "#64748b",
          }}
        >

          {icon}

          <Typography
            variant="caption"
          >
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
      item
      xs={6}
    >

      <Box
        sx={{
          p: 1.5,
          borderRadius: 2.5,
          backgroundColor:
            "#f8fafc",
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
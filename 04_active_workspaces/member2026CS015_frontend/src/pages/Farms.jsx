import { useState } from "react";

import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

export default function Farms() {
  const [farms, setFarms] = useState([
    {
      id: 1,
      name: "Green Valley Farm",
      location: "Pune",
      animals: 45,
      status: "Active",
    },
    {
      id: 2,
      name: "Sunrise Dairy",
      location: "Nashik",
      animals: 60,
      status: "Active",
    },
    {
      id: 3,
      name: "Hill Farm",
      location: "Satara",
      animals: 30,
      status: "Inactive",
    },
  ]);

  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);

  const [editingFarm, setEditingFarm] = useState(null);

  const [newFarm, setNewFarm] = useState({
    name: "",
    location: "",
    animals: "",
    status: "Active",
  });

  const filteredFarms = farms.filter(
    (farm) =>
      farm.name.toLowerCase().includes(search.toLowerCase()) ||
      farm.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (!newFarm.name || !newFarm.location || !newFarm.animals) {
      alert("Please fill all fields");
      return;
    }

    if (editingFarm) {
      setFarms(
        farms.map((farm) =>
          farm.id === editingFarm.id
            ? {
                ...farm,
                ...newFarm,
              }
            : farm
        )
      );
    } else {
      setFarms([
        ...farms,
        {
          id: farms.length + 1,
          ...newFarm,
        },
      ]);
    }

    setOpen(false);

    setEditingFarm(null);

    setNewFarm({
      name: "",
      location: "",
      animals: "",
      status: "Active",
    });
  };

  const handleEdit = (farm) => {
    setEditingFarm(farm);

    setNewFarm({
      name: farm.name,
      location: farm.location,
      animals: farm.animals,
      status: farm.status,
    });

    setOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this farm?")) {
      setFarms(farms.filter((farm) => farm.id !== id));
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Farms Management
      </Typography>

      <Box
        display="flex"
        justifyContent="space-between"
        mb={3}
      >
        <TextField
          label="Search Farm"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button
          variant="contained"
          color="success"
          onClick={() => {
            setEditingFarm(null);

            setNewFarm({
              name: "",
              location: "",
              animals: "",
              status: "Active",
            });

            setOpen(true);
          }}
        >
          + Add Farm
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>

          <TableHead>
            <TableRow>
              <TableCell><b>ID</b></TableCell>
              <TableCell><b>Farm Name</b></TableCell>
              <TableCell><b>Location</b></TableCell>
              <TableCell><b>Animals</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>

            {filteredFarms.map((farm) => (
              <TableRow key={farm.id}>
                <TableCell>{farm.id}</TableCell>
                <TableCell>{farm.name}</TableCell>
                <TableCell>{farm.location}</TableCell>
                <TableCell>{farm.animals}</TableCell>

                <TableCell>
                  <Chip
                    label={farm.status}
                    color={
                      farm.status === "Active"
                        ? "success"
                        : "error"
                    }
                  />
                </TableCell>

                <TableCell>
                  <Button
                    size="small"
                    onClick={() => handleEdit(farm)}
                  >
                    Edit
                  </Button>

                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(farm.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}

          </TableBody>

        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
      >
        <DialogTitle>
          {editingFarm ? "Edit Farm" : "Add Farm"}
        </DialogTitle>

        <DialogContent>

          <TextField
            label="Farm Name"
            fullWidth
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
            label="Location"
            fullWidth
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
            label="Animals"
            type="number"
            fullWidth
            margin="normal"
            value={newFarm.animals}
            onChange={(e) =>
              setNewFarm({
                ...newFarm,
                animals: e.target.value,
              })
            }
          />

        </DialogContent>

        <DialogActions>

          <Button onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
          >
            Save
          </Button>

        </DialogActions>
      </Dialog>

    </Box>
  );
}
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
  MenuItem,
} from "@mui/material";

export default function Animals() {
  const [animals, setAnimals] = useState([
    {
      id: "A001",
      type: "Cow",
      breed: "Holstein",
      age: 4,
      weight: 520,
      health: "Healthy",
    },
    {
      id: "A002",
      type: "Buffalo",
      breed: "Murrah",
      age: 5,
      weight: 610,
      health: "Healthy",
    },
    {
      id: "A003",
      type: "Sheep",
      breed: "Merino",
      age: 2,
      weight: 75,
      health: "Under Observation",
    },
  ]);

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState(null);

  const [newAnimal, setNewAnimal] = useState({
    id: "",
    type: "",
    breed: "",
    age: "",
    weight: "",
    health: "Healthy",
  });

  const filteredAnimals = animals.filter(
    (animal) =>
      animal.id.toLowerCase().includes(search.toLowerCase()) ||
      animal.type.toLowerCase().includes(search.toLowerCase()) ||
      animal.breed.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (
      !newAnimal.id ||
      !newAnimal.type ||
      !newAnimal.breed ||
      !newAnimal.age ||
      !newAnimal.weight
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (editingAnimal) {
      setAnimals(
        animals.map((animal) =>
          animal.id === editingAnimal.id ? newAnimal : animal
        )
      );
    } else {
      setAnimals([...animals, newAnimal]);
    }

    setOpen(false);
    setEditingAnimal(null);

    setNewAnimal({
      id: "",
      type: "",
      breed: "",
      age: "",
      weight: "",
      health: "Healthy",
    });
  };

  const handleEdit = (animal) => {
    setEditingAnimal(animal);
    setNewAnimal(animal);
    setOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this animal?")) {
      setAnimals(animals.filter((animal) => animal.id !== id));
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Animals Management
      </Typography>

      <Box display="flex" justifyContent="space-between" mb={3}>
        <TextField
          label="Search Animal"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button
          variant="contained"
          color="success"
          onClick={() => {
            setEditingAnimal(null);
            setNewAnimal({
              id: "",
              type: "",
              breed: "",
              age: "",
              weight: "",
              health: "Healthy",
            });
            setOpen(true);
          }}
        >
          + Add Animal
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>

          <TableHead>
            <TableRow>
              <TableCell><b>ID</b></TableCell>
              <TableCell><b>Type</b></TableCell>
              <TableCell><b>Breed</b></TableCell>
              <TableCell><b>Age</b></TableCell>
              <TableCell><b>Weight (Kg)</b></TableCell>
              <TableCell><b>Health</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredAnimals.map((animal) => (
              <TableRow key={animal.id}>
                <TableCell>{animal.id}</TableCell>
                <TableCell>{animal.type}</TableCell>
                <TableCell>{animal.breed}</TableCell>
                <TableCell>{animal.age}</TableCell>
                <TableCell>{animal.weight}</TableCell>

                <TableCell>
                  <Chip
                    label={animal.health}
                    color={
                      animal.health === "Healthy"
                        ? "success"
                        : animal.health === "Sick"
                        ? "error"
                        : "warning"
                    }
                  />
                </TableCell>

                <TableCell>
                  <Button
                    size="small"
                    onClick={() => handleEdit(animal)}
                  >
                    Edit
                  </Button>

                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(animal.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>
          {editingAnimal ? "Edit Animal" : "Add Animal"}
        </DialogTitle>

        <DialogContent>

          <TextField
            label="Animal ID"
            fullWidth
            margin="normal"
            value={newAnimal.id}
            onChange={(e) =>
              setNewAnimal({ ...newAnimal, id: e.target.value })
            }
          />

          <TextField
            label="Animal Type"
            fullWidth
            margin="normal"
            value={newAnimal.type}
            onChange={(e) =>
              setNewAnimal({ ...newAnimal, type: e.target.value })
            }
          />

          <TextField
            label="Breed"
            fullWidth
            margin="normal"
            value={newAnimal.breed}
            onChange={(e) =>
              setNewAnimal({ ...newAnimal, breed: e.target.value })
            }
          />

          <TextField
            label="Age"
            type="number"
            fullWidth
            margin="normal"
            value={newAnimal.age}
            onChange={(e) =>
              setNewAnimal({ ...newAnimal, age: e.target.value })
            }
          />

          <TextField
            label="Weight (Kg)"
            type="number"
            fullWidth
            margin="normal"
            value={newAnimal.weight}
            onChange={(e) =>
              setNewAnimal({ ...newAnimal, weight: e.target.value })
            }
          />

          <TextField
            select
            label="Health Status"
            fullWidth
            margin="normal"
            value={newAnimal.health}
            onChange={(e) =>
              setNewAnimal({ ...newAnimal, health: e.target.value })
            }
          >
            <MenuItem value="Healthy">Healthy</MenuItem>
            <MenuItem value="Sick">Sick</MenuItem>
            <MenuItem value="Under Observation">
              Under Observation
            </MenuItem>
          </TextField>

        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

export default function Eggs() {
  const [eggData, setEggData] = useState([
    {
      id: "E001",
      poultryId: "P001",
      birdType: "Layer Hen",
      date: "2026-08-03",
      eggs: 120,
    },
    {
      id: "E002",
      poultryId: "P002",
      birdType: "Layer Hen",
      date: "2026-08-03",
      eggs: 95,
    },
    {
      id: "E003",
      poultryId: "P003",
      birdType: "Country Chicken",
      date: "2026-08-02",
      eggs: 40,
    },
  ]);

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingEgg, setEditingEgg] = useState(null);

  const [newEgg, setNewEgg] = useState({
    id: "",
    poultryId: "",
    birdType: "",
    date: "",
    eggs: "",
  });

  const filteredEggs = eggData.filter(
    (egg) =>
      egg.id.toLowerCase().includes(search.toLowerCase()) ||
      egg.poultryId.toLowerCase().includes(search.toLowerCase()) ||
      egg.birdType.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (
      !newEgg.id ||
      !newEgg.poultryId ||
      !newEgg.birdType ||
      !newEgg.date ||
      !newEgg.eggs
    ) {
      alert("Please fill all fields");
      return;
    }

    if (editingEgg) {
      setEggData(
        eggData.map((egg) =>
          egg.id === editingEgg.id ? newEgg : egg
        )
      );
    } else {
      setEggData([...eggData, newEgg]);
    }

    setOpen(false);
    setEditingEgg(null);

    setNewEgg({
      id: "",
      poultryId: "",
      birdType: "",
      date: "",
      eggs: "",
    });
  };

  const handleEdit = (egg) => {
    setEditingEgg(egg);
    setNewEgg(egg);
    setOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this record?")) {
      setEggData(eggData.filter((egg) => egg.id !== id));
    }
  };

  const totalEggs = eggData.reduce(
    (sum, egg) => sum + Number(egg.eggs),
    0
  );

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Egg Production Management
      </Typography>

      <Typography
        variant="h6"
        color="success.main"
        mb={2}
      >
        Total Eggs Produced : {totalEggs}
      </Typography>

      <Box
        display="flex"
        justifyContent="space-between"
        mb={3}
      >
        <TextField
          label="Search Record"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button
          variant="contained"
          color="success"
          onClick={() => {
            setEditingEgg(null);
            setNewEgg({
              id: "",
              poultryId: "",
              birdType: "",
              date: "",
              eggs: "",
            });
            setOpen(true);
          }}
        >
          + Add Record
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>

          <TableHead>
            <TableRow>
              <TableCell><b>Record ID</b></TableCell>
              <TableCell><b>Poultry ID</b></TableCell>
              <TableCell><b>Bird Type</b></TableCell>
              <TableCell><b>Date</b></TableCell>
              <TableCell><b>Eggs</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredEggs.map((egg) => (
              <TableRow key={egg.id}>
                <TableCell>{egg.id}</TableCell>
                <TableCell>{egg.poultryId}</TableCell>
                <TableCell>{egg.birdType}</TableCell>
                <TableCell>{egg.date}</TableCell>
                <TableCell>{egg.eggs}</TableCell>

                <TableCell>
                  <Button
                    size="small"
                    onClick={() => handleEdit(egg)}
                  >
                    Edit
                  </Button>

                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(egg.id)}
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
          {editingEgg
            ? "Edit Egg Record"
            : "Add Egg Record"}
        </DialogTitle>

        <DialogContent>

          <TextField
            label="Record ID"
            fullWidth
            margin="normal"
            value={newEgg.id}
            onChange={(e) =>
              setNewEgg({
                ...newEgg,
                id: e.target.value,
              })
            }
          />

          <TextField
            label="Poultry ID"
            fullWidth
            margin="normal"
            value={newEgg.poultryId}
            onChange={(e) =>
              setNewEgg({
                ...newEgg,
                poultryId: e.target.value,
              })
            }
          />

          <TextField
            label="Bird Type"
            fullWidth
            margin="normal"
            value={newEgg.birdType}
            onChange={(e) =>
              setNewEgg({
                ...newEgg,
                birdType: e.target.value,
              })
            }
          />

          <TextField
            type="date"
            fullWidth
            margin="normal"
            value={newEgg.date}
            onChange={(e) =>
              setNewEgg({
                ...newEgg,
                date: e.target.value,
              })
            }
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Number of Eggs"
            type="number"
            fullWidth
            margin="normal"
            value={newEgg.eggs}
            onChange={(e) =>
              setNewEgg({
                ...newEgg,
                eggs: e.target.value,
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
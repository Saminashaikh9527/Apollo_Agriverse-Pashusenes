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

export default function Wool() {
  const [woolData, setWoolData] = useState([
    {
      id: "W001",
      animalId: "S001",
      animal: "Merino Sheep",
      date: "2026-08-03",
      quantity: 4.5,
    },
    {
      id: "W002",
      animalId: "S002",
      animal: "Rambouillet Sheep",
      date: "2026-08-02",
      quantity: 5.2,
    },
    {
      id: "W003",
      animalId: "S003",
      animal: "Suffolk Sheep",
      date: "2026-08-01",
      quantity: 3.8,
    },
  ]);

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingWool, setEditingWool] = useState(null);

  const [newWool, setNewWool] = useState({
    id: "",
    animalId: "",
    animal: "",
    date: "",
    quantity: "",
  });

  const filteredWool = woolData.filter(
    (wool) =>
      wool.id.toLowerCase().includes(search.toLowerCase()) ||
      wool.animalId.toLowerCase().includes(search.toLowerCase()) ||
      wool.animal.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (
      !newWool.id ||
      !newWool.animalId ||
      !newWool.animal ||
      !newWool.date ||
      !newWool.quantity
    ) {
      alert("Please fill all fields");
      return;
    }

    if (editingWool) {
      setWoolData(
        woolData.map((item) =>
          item.id === editingWool.id ? newWool : item
        )
      );
    } else {
      setWoolData([...woolData, newWool]);
    }

    setOpen(false);
    setEditingWool(null);

    setNewWool({
      id: "",
      animalId: "",
      animal: "",
      date: "",
      quantity: "",
    });
  };

  const handleEdit = (item) => {
    setEditingWool(item);
    setNewWool(item);
    setOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this record?")) {
      setWoolData(woolData.filter((item) => item.id !== id));
    }
  };

  const totalWool = woolData.reduce(
    (sum, item) => sum + Number(item.quantity),
    0
  );

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Wool Management
      </Typography>

      <Typography variant="h6" color="success.main" mb={2}>
        Total Wool Collected : {totalWool} Kg
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
            setEditingWool(null);
            setNewWool({
              id: "",
              animalId: "",
              animal: "",
              date: "",
              quantity: "",
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
              <TableCell><b>Animal ID</b></TableCell>
              <TableCell><b>Animal</b></TableCell>
              <TableCell><b>Date</b></TableCell>
              <TableCell><b>Wool (Kg)</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredWool.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.animalId}</TableCell>
                <TableCell>{item.animal}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.quantity}</TableCell>

                <TableCell>
                  <Button
                    size="small"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </Button>

                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(item.id)}
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
          {editingWool ? "Edit Wool Record" : "Add Wool Record"}
        </DialogTitle>

        <DialogContent>

          <TextField
            label="Record ID"
            fullWidth
            margin="normal"
            value={newWool.id}
            onChange={(e) =>
              setNewWool({ ...newWool, id: e.target.value })
            }
          />

          <TextField
            label="Animal ID"
            fullWidth
            margin="normal"
            value={newWool.animalId}
            onChange={(e) =>
              setNewWool({ ...newWool, animalId: e.target.value })
            }
          />

          <TextField
            label="Animal Name"
            fullWidth
            margin="normal"
            value={newWool.animal}
            onChange={(e) =>
              setNewWool({ ...newWool, animal: e.target.value })
            }
          />

          <TextField
            type="date"
            fullWidth
            margin="normal"
            value={newWool.date}
            onChange={(e) =>
              setNewWool({ ...newWool, date: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Wool Quantity (Kg)"
            type="number"
            fullWidth
            margin="normal"
            value={newWool.quantity}
            onChange={(e) =>
              setNewWool({ ...newWool, quantity: e.target.value })
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
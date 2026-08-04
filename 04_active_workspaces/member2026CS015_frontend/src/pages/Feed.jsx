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

export default function Feed() {
  const [feeds, setFeeds] = useState([
    {
      id: "F001",
      type: "Green Fodder",
      quantity: 250,
      unit: "Kg",
      supplier: "ABC Agro",
      status: "Available",
    },
    {
      id: "F002",
      type: "Dry Hay",
      quantity: 180,
      unit: "Kg",
      supplier: "Farm Fresh",
      status: "Low Stock",
    },
    {
      id: "F003",
      type: "Concentrate Feed",
      quantity: 500,
      unit: "Kg",
      supplier: "Nutri Feed",
      status: "Available",
    },
  ]);

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingFeed, setEditingFeed] = useState(null);

  const [newFeed, setNewFeed] = useState({
    id: "",
    type: "",
    quantity: "",
    unit: "Kg",
    supplier: "",
    status: "Available",
  });

  const filteredFeeds = feeds.filter(
    (feed) =>
      feed.id.toLowerCase().includes(search.toLowerCase()) ||
      feed.type.toLowerCase().includes(search.toLowerCase()) ||
      feed.supplier.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (
      !newFeed.id ||
      !newFeed.type ||
      !newFeed.quantity ||
      !newFeed.supplier
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (editingFeed) {
      setFeeds(
        feeds.map((feed) =>
          feed.id === editingFeed.id ? newFeed : feed
        )
      );
    } else {
      setFeeds([...feeds, newFeed]);
    }

    setOpen(false);
    setEditingFeed(null);

    setNewFeed({
      id: "",
      type: "",
      quantity: "",
      unit: "Kg",
      supplier: "",
      status: "Available",
    });
  };

  const handleEdit = (feed) => {
    setEditingFeed(feed);
    setNewFeed(feed);
    setOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this feed item?")) {
      setFeeds(feeds.filter((feed) => feed.id !== id));
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Feed Management
      </Typography>

      <Box display="flex" justifyContent="space-between" mb={3}>
        <TextField
          label="Search Feed"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button
          variant="contained"
          color="success"
          onClick={() => {
            setEditingFeed(null);
            setNewFeed({
              id: "",
              type: "",
              quantity: "",
              unit: "Kg",
              supplier: "",
              status: "Available",
            });
            setOpen(true);
          }}
        >
          + Add Feed
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>

          <TableHead>
            <TableRow>
              <TableCell><b>Feed ID</b></TableCell>
              <TableCell><b>Feed Type</b></TableCell>
              <TableCell><b>Quantity</b></TableCell>
              <TableCell><b>Unit</b></TableCell>
              <TableCell><b>Supplier</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredFeeds.map((feed) => (
              <TableRow key={feed.id}>
                <TableCell>{feed.id}</TableCell>
                <TableCell>{feed.type}</TableCell>
                <TableCell>{feed.quantity}</TableCell>
                <TableCell>{feed.unit}</TableCell>
                <TableCell>{feed.supplier}</TableCell>

                <TableCell>
                  <Chip
                    label={feed.status}
                    color={
                      feed.status === "Available"
                        ? "success"
                        : "warning"
                    }
                  />
                </TableCell>

                <TableCell>
                  <Button
                    size="small"
                    onClick={() => handleEdit(feed)}
                  >
                    Edit
                  </Button>

                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(feed.id)}
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
          {editingFeed ? "Edit Feed" : "Add Feed"}
        </DialogTitle>

        <DialogContent>

          <TextField
            label="Feed ID"
            fullWidth
            margin="normal"
            value={newFeed.id}
            onChange={(e) =>
              setNewFeed({ ...newFeed, id: e.target.value })
            }
          />

          <TextField
            label="Feed Type"
            fullWidth
            margin="normal"
            value={newFeed.type}
            onChange={(e) =>
              setNewFeed({ ...newFeed, type: e.target.value })
            }
          />

          <TextField
            label="Quantity"
            type="number"
            fullWidth
            margin="normal"
            value={newFeed.quantity}
            onChange={(e) =>
              setNewFeed({ ...newFeed, quantity: e.target.value })
            }
          />

          <TextField
            label="Supplier"
            fullWidth
            margin="normal"
            value={newFeed.supplier}
            onChange={(e) =>
              setNewFeed({ ...newFeed, supplier: e.target.value })
            }
          />

          <TextField
            select
            label="Status"
            fullWidth
            margin="normal"
            value={newFeed.status}
            onChange={(e) =>
              setNewFeed({ ...newFeed, status: e.target.value })
            }
          >
            <MenuItem value="Available">Available</MenuItem>
            <MenuItem value="Low Stock">Low Stock</MenuItem>
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
import {
  Box,
  Drawer,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
  Chip,
  Button,
} from "@mui/material";

import {
  Dashboard as DashboardIcon,
  Agriculture,
  Pets,
  Biotech,
  Grass,
  LocalDrink,
  Egg,
  Texture,
  Psychology,
  TrendingUp,
  Assessment,
  Settings,
  Logout,
  Menu,
  ChevronLeft,
  Notifications,
  HealthAndSafety,
  ShowChart,
  Vaccines,
  Home,
  ArrowBack,
} from "@mui/icons-material";

import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const drawerWidth = 270;

export default function MainLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const menuSections = [
    {
      title: "MAIN",
      items: [
        {
          label: "Dashboard",
          icon: <DashboardIcon />,
          path: "/dashboard",
          color: "#8b5cf6",
          bg: "#ede9fe",
        },
        {
          label: "Farms",
          icon: <Agriculture />,
          path: "/farms",
          color: "#16a34a",
          bg: "#dcfce7",
        },
        {
          label: "Animals",
          icon: <Pets />,
          path: "/animals",
          color: "#f97316",
          bg: "#ffedd5",
        },
        {
          label: "Digital Twin",
          icon: <Biotech />,
          path: "/digital-twin",
          color: "#06b6d4",
          bg: "#cffafe",
        },
      ],
    },

    {
      title: "FARM MANAGEMENT",
      items: [
        {
          label: "Feed",
          icon: <Grass />,
          path: "/feed",
          color: "#84cc16",
          bg: "#ecfccb",
        },
        {
          label: "Milk",
          icon: <LocalDrink />,
          path: "/milk",
          color: "#2563eb",
          bg: "#dbeafe",
        },
        {
          label: "Eggs",
          icon: <Egg />,
          path: "/eggs",
          color: "#eab308",
          bg: "#fef9c3",
        },
        {
          label: "Wool",
          icon: <Texture />,
          path: "/wool",
          color: "#ec4899",
          bg: "#fce7f3",
        },
        {
          label: "Health",
          icon: <HealthAndSafety />,
          path: "/health",
          color: "#dc2626",
          bg: "#fee2e2",
        },
        {
          label: "Growth",
          icon: <ShowChart />,
          path: "/growth",
          color: "#0891b2",
          bg: "#cffafe",
        },
        {
          label: "Vaccination",
          icon: <Vaccines />,
          path: "/vaccination",
          color: "#7c3aed",
          bg: "#ede9fe",
        },
      ],
    },

    {
      title: "AI & ANALYTICS",
      items: [
        {
          label: "AI Monitoring",
          icon: <Psychology />,
          path: "/ai-monitoring",
          color: "#7c3aed",
          bg: "#ede9fe",
        },
        {
          label: "Predictions",
          icon: <TrendingUp />,
          path: "/predictions",
          color: "#0ea5e9",
          bg: "#e0f2fe",
        },
        {
          label: "Reports",
          icon: <Assessment />,
          path: "/reports",
          color: "#14b8a6",
          bg: "#ccfbf1",
        },
      ],
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleHome = () => {
    navigate("/");
    setMobileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("user");

    navigate("/");
  };

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background:
          "linear-gradient(180deg, #064e3b 0%, #047857 48%, #065f46 100%)",
        color: "white",
      }}
    >
      {/* =====================================================
          LOGO
      ====================================================== */}

      <Box
        sx={{
          minHeight: 88,
          display: "flex",
          alignItems: "center",
          px: collapsed ? 1.5 : 2.5,
          justifyContent: collapsed ? "center" : "flex-start",
          gap: 1.5,
        }}
      >
        <Avatar
          sx={{
            width: 48,
            height: 48,
            fontSize: 24,
            background:
              "linear-gradient(135deg, #facc15, #f97316)",
            boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
          }}
        >
          🐄
        </Avatar>

        {!collapsed && (
          <Box>
            <Typography
              sx={{
                fontWeight: 900,
                fontSize: 17,
                lineHeight: 1.2,
                color: "white",
              }}
            >
              Apollo Agriverse
            </Typography>

            <Typography
              sx={{
                fontWeight: 800,
                fontSize: 15,
                color: "#fef3c7",
                mt: 0.2,
              }}
            >
              PashuSense
            </Typography>

            <Typography
              sx={{
                fontSize: 10,
                color: "#bbf7d0",
                mt: 0.3,
              }}
            >
              Precision Livestock Farming
            </Typography>
          </Box>
        )}
      </Box>

      <Divider
        sx={{
          borderColor: "rgba(255,255,255,0.15)",
        }}
      />

      {/* =====================================================
          BACK TO HOME BUTTON
      ====================================================== */}

      {!collapsed ? (
        <Box sx={{ px: 1.8, pt: 1.8 }}>
          <Button
            fullWidth
            startIcon={<Home />}
            onClick={handleHome}
            sx={{
              minHeight: 44,
              borderRadius: 2.5,
              justifyContent: "flex-start",
              px: 1.5,
              textTransform: "none",
              fontWeight: 800,
              color: "#064e3b",
              backgroundColor: "white",
              boxShadow: "0 5px 15px rgba(0,0,0,0.12)",

              "&:hover": {
                backgroundColor: "#f0fdf4",
                transform: "translateX(2px)",
              },

              transition: "all 0.2s ease",
            }}
          >
            Back to Home
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            pt: 1.5,
          }}
        >
          <Tooltip title="Back to Home" placement="right">
            <IconButton
              onClick={handleHome}
              sx={{
                width: 46,
                height: 46,
                color: "#064e3b",
                backgroundColor: "white",

                "&:hover": {
                  backgroundColor: "#f0fdf4",
                },
              }}
            >
              <Home />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {/* =====================================================
          FARM STATUS
      ====================================================== */}

      {!collapsed && (
        <Box
          sx={{
            mx: 1.8,
            mt: 1.8,
            mb: 1,
            p: 1.5,
            borderRadius: 3,
            background: "rgba(255,255,255,0.10)",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: 11,
                  color: "#a7f3d0",
                }}
              >
                CURRENT FARM
              </Typography>

              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: 14,
                  color: "white",
                }}
              >
                My Farm
              </Typography>
            </Box>

            <Chip
              label="LIVE"
              size="small"
              sx={{
                height: 22,
                fontSize: 9,
                fontWeight: 800,
                color: "#166534",
                backgroundColor: "#86efac",
              }}
            />
          </Box>
        </Box>
      )}

      {/* =====================================================
          NAVIGATION
      ====================================================== */}

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 1.5,
          py: 1.5,

          "&::-webkit-scrollbar": {
            width: 5,
          },

          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(255,255,255,0.2)",
            borderRadius: 5,
          },
        }}
      >
        {menuSections.map((section) => (
          <Box
            key={section.title}
            sx={{
              mb: 2.5,
            }}
          >
            {!collapsed && (
              <Typography
                sx={{
                  px: 1.5,
                  mb: 0.8,
                  fontSize: 10,
                  fontWeight: 900,
                  color: "#a7f3d0",
                  letterSpacing: "1.2px",
                }}
              >
                {section.title}
              </Typography>
            )}

            {section.items.map((item) => {
              const active =
                location.pathname === item.path;

              return (
                <Tooltip
                  key={item.path}
                  title={collapsed ? item.label : ""}
                  placement="right"
                >
                  <ListItemButton
                    onClick={() =>
                      handleNavigation(item.path)
                    }
                    sx={{
                      minHeight: 50,
                      mb: 0.7,
                      borderRadius: 2.8,

                      justifyContent: collapsed
                        ? "center"
                        : "flex-start",

                      px: collapsed ? 1 : 1.2,

                      position: "relative",

                      color: active
                        ? "#064e3b"
                        : "#ecfdf5",

                      backgroundColor: active
                        ? "white"
                        : "transparent",

                      boxShadow: active
                        ? "0 5px 18px rgba(0,0,0,0.12)"
                        : "none",

                      transition: "all 0.2s ease",

                      "&:hover": {
                        backgroundColor: active
                          ? "white"
                          : "rgba(255,255,255,0.12)",

                        transform: "translateX(3px)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: collapsed ? 0 : 42,
                        justifyContent: "center",
                      }}
                    >
                      <Box
                        sx={{
                          width: 34,
                          height: 34,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 2,
                          backgroundColor: item.bg,
                          color: item.color,

                          boxShadow: active
                            ? `0 4px 12px ${item.color}40`
                            : "none",
                        }}
                      >
                        {item.icon}
                      </Box>
                    </ListItemIcon>

                    {!collapsed && (
                      <ListItemText
                        primary={
                          <Typography
                            component="span"
                            sx={{
                              display: "block",
                              fontSize: 14,
                              fontWeight: active ? 800 : 600,
                              color: "inherit",
                            }}
                          >
                            {item.label}
                          </Typography>
                        }
                      />
                    )}

                    {active && !collapsed && (
                      <Box
                        sx={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          backgroundColor: "#10b981",
                          boxShadow: "0 0 10px #10b981",
                        }}
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              );
            })}
          </Box>
        ))}

        {/* =====================================================
            SETTINGS
        ====================================================== */}

        <Tooltip
          title={collapsed ? "Settings" : ""}
          placement="right"
        >
          <ListItemButton
            onClick={() =>
              handleNavigation("/settings")
            }
            sx={{
              minHeight: 50,
              borderRadius: 2.8,

              justifyContent: collapsed
                ? "center"
                : "flex-start",

              px: collapsed ? 1 : 1.2,

              color:
                location.pathname === "/settings"
                  ? "#064e3b"
                  : "#ecfdf5",

              backgroundColor:
                location.pathname === "/settings"
                  ? "white"
                  : "transparent",

              "&:hover": {
                backgroundColor:
                  "rgba(255,255,255,0.12)",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: collapsed ? 0 : 42,
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 2,
                  backgroundColor: "#f3f4f6",
                  color: "#6b7280",
                }}
              >
                <Settings />
              </Box>
            </ListItemIcon>

            {!collapsed && (
              <ListItemText
                primary={
                  <Typography
                    component="span"
                    sx={{
                      display: "block",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "inherit",
                    }}
                  >
                    Settings
                  </Typography>
                }
              />
            )}
          </ListItemButton>
        </Tooltip>
      </Box>

      {/* =====================================================
          USER PROFILE
      ====================================================== */}

      <Box
        sx={{
          p: 1.5,
          borderTop:
            "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.2,
            p: 1.2,
            borderRadius: 3,
            background:
              "rgba(255,255,255,0.10)",
          }}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              background:
                "linear-gradient(135deg, #fbbf24, #f97316)",
              color: "white",
              fontWeight: 800,
            }}
          >
            A
          </Avatar>

          {!collapsed && (
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
              }}
            >
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: "white",
                }}
              >
                Admin
              </Typography>

              <Typography
                sx={{
                  fontSize: 11,
                  color: "#a7f3d0",
                }}
              >
                Farm Manager
              </Typography>
            </Box>
          )}

          {!collapsed && (
            <Tooltip title="Notifications">
              <IconButton
                size="small"
                sx={{
                  color: "white",
                }}
              >
                <Notifications fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* =====================================================
            LOGOUT
        ====================================================== */}

        <ListItemButton
          onClick={handleLogout}
          sx={{
            mt: 1,
            minHeight: 44,
            borderRadius: 2.5,

            justifyContent: collapsed
              ? "center"
              : "flex-start",

            px: collapsed ? 1 : 1.2,

            color: "#fecaca",

            "&:hover": {
              backgroundColor:
                "rgba(239,68,68,0.15)",
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: collapsed ? 0 : 42,
              color: "#fca5a5",
              justifyContent: "center",
            }}
          >
            <Logout />
          </ListItemIcon>

          {!collapsed && (
            <ListItemText
              primary={
                <Typography
                  component="span"
                  sx={{
                    display: "block",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "inherit",
                  }}
                >
                  Logout
                </Typography>
              }
            />
          )}
        </ListItemButton>
      </Box>

      {/* =====================================================
          COLLAPSE BUTTON
      ====================================================== */}

      <Box
        sx={{
          display: {
            xs: "none",
            md: "flex",
          },

          justifyContent: "center",

          py: 1,

          borderTop:
            "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <IconButton
          onClick={() =>
            setCollapsed(!collapsed)
          }
          sx={{
            color: "#d1fae5",

            "&:hover": {
              backgroundColor:
                "rgba(255,255,255,0.1)",
            },
          }}
        >
          {collapsed ? <Menu /> : <ChevronLeft />}
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f7f9f8",
      }}
    >
      {/* =====================================================
          DESKTOP DRAWER
      ====================================================== */}

      <Drawer
        variant="permanent"
        sx={{
          display: {
            xs: "none",
            md: "block",
          },

          width: collapsed
            ? 82
            : drawerWidth,

          flexShrink: 0,

          "& .MuiDrawer-paper": {
            width: collapsed
              ? 82
              : drawerWidth,

            boxSizing: "border-box",

            border: "none",

            transition:
              "width 0.25s ease",

            overflowX: "hidden",

            boxShadow:
              "4px 0 20px rgba(0,0,0,0.08)",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* =====================================================
          MOBILE DRAWER
      ====================================================== */}

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() =>
          setMobileOpen(false)
        }
        sx={{
          display: {
            xs: "block",
            md: "none",
          },

          "& .MuiDrawer-paper": {
            width: drawerWidth,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
        }}
      >
        {/* =====================================================
            MOBILE HEADER
        ====================================================== */}

        <Box
          sx={{
            display: {
              xs: "flex",
              md: "none",
            },

            height: 64,

            alignItems: "center",

            justifyContent:
              "space-between",

            px: 2,

            backgroundColor: "white",

            borderBottom:
              "1px solid #e5e7eb",
          }}
        >
          <IconButton
            onClick={() =>
              setMobileOpen(true)
            }
          >
            <Menu />
          </IconButton>

          <Typography
            sx={{
              fontWeight: 900,
              color: "#047857",
              fontSize: 14,
            }}
          >
            🐄 Apollo Agriverse PashuSense
          </Typography>

          <IconButton>
            <Notifications />
          </IconButton>
        </Box>

        {children}
      </Box>
    </Box>
  );
}
import { useState } from "react";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Avatar,
  LinearProgress,
  Divider,
} from "@mui/material";

import {
  Dashboard as DashboardIcon,
  Pets,
  LocalDrink,
  Egg,
  Agriculture,
  Warning,
  CheckCircle,
  TrendingUp,
  WaterDrop,
  Restaurant,
  Thermostat,
  Visibility,
  ArrowForward,
  NotificationsActive,
  Psychology,
  Wifi,
} from "@mui/icons-material";


export default function Dashboard() {

  const [selectedFarm] = useState(
    "Green Valley Farm"
  );


  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f4f7fb",
        p: {
          xs: 2,
          sm: 3,
          md: 4,
        },
      }}
    >

      {/* =====================================================
          HEADER
      ====================================================== */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            md: "center",
          },
          flexDirection: {
            xs: "column",
            md: "row",
          },
          gap: 2,
          mb: 3,
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
                width: 54,
                height: 54,
                backgroundColor: "#dcfce7",
                color: "#16a34a",
              }}
            >
              <DashboardIcon
                sx={{
                  fontSize: 30,
                }}
              />
            </Avatar>

            <Box>

              <Typography
                variant="h4"
                fontWeight={900}
                color="#111827"
              >
                Dashboard 🌾
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 0.5,
                }}
              >
                Welcome back, Admin. Here's what's
                happening on your farm today.
              </Typography>

            </Box>

          </Box>

        </Box>


        {/* CURRENT FARM */}

        <Box
          sx={{
            minWidth: {
              xs: "100%",
              md: 250,
            },
            backgroundColor: "#ffffff",
            borderRadius: 3,
            border: "1px solid #e5e7eb",
            p: 1.5,
          }}
        >

          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={700}
          >
            CURRENT FARM
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 0.5,
            }}
          >

            <Typography
              fontWeight={900}
            >
              {selectedFarm}
            </Typography>

            <Chip
              label="LIVE"
              size="small"
              sx={{
                backgroundColor: "#dcfce7",
                color: "#15803d",
                fontWeight: 900,
              }}
            />

          </Box>

        </Box>

      </Box>


      {/* =====================================================
          QUICK STATUS
      ====================================================== */}

      <Grid
        container
        spacing={2}
        sx={{
          mb: 3,
        }}
      >

        <StatCard
          title="Total Animals"
          value="147"
          subtitle="+8 this month"
          icon={<Pets />}
          background="#eff6ff"
          iconBackground="#dbeafe"
          iconColor="#2563eb"
          trend
        />

        <StatCard
          title="Milk Production"
          value="402 L"
          subtitle="Today's production"
          icon={<LocalDrink />}
          background="#ecfeff"
          iconBackground="#cffafe"
          iconColor="#0891b2"
          trend
        />

        <StatCard
          title="Healthy Animals"
          value="138"
          subtitle="93.9% healthy"
          icon={<CheckCircle />}
          background="#f0fdf4"
          iconBackground="#dcfce7"
          iconColor="#16a34a"
          trend
        />

        <StatCard
          title="Alerts"
          value="5"
          subtitle="Needs attention"
          icon={<Warning />}
          background="#fff7ed"
          iconBackground="#ffedd5"
          iconColor="#ea580c"
          alert
        />

      </Grid>


      {/* =====================================================
          AI + FARM HEALTH
      ====================================================== */}

      <Grid
        container
        spacing={3}
        sx={{
          mb: 3,
        }}
      >

        {/* FARM HEALTH */}

        <Grid
          item
          xs={12}
          md={7}
        >

          <Card
            sx={{
              height: "100%",
              borderRadius: 4,
              boxShadow: "none",
              border: "1px solid #e5e7eb",
            }}
          >

            <CardContent
              sx={{
                p: 3,
              }}
            >

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >

                <Box>

                  <Typography
                    variant="h6"
                    fontWeight={900}
                  >
                    Farm Health Overview
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Overall condition of your livestock
                  </Typography>

                </Box>

                <Chip
                  icon={<CheckCircle />}
                  label="Healthy"
                  sx={{
                    backgroundColor: "#dcfce7",
                    color: "#15803d",
                    fontWeight: 800,
                  }}
                />

              </Box>


              {/* HEALTH PROGRESS */}

              <HealthBar
                label="Overall Animal Health"
                value={94}
                color="#16a34a"
              />

              <HealthBar
                label="Nutrition Status"
                value={88}
                color="#2563eb"
              />

              <HealthBar
                label="Vaccination Coverage"
                value={91}
                color="#7c3aed"
              />

              <HealthBar
                label="Environmental Comfort"
                value={86}
                color="#0891b2"
              />

            </CardContent>

          </Card>

        </Grid>


        {/* AI MONITORING */}

        <Grid
          item
          xs={12}
          md={5}
        >

          <Card
            sx={{
              height: "100%",
              borderRadius: 4,
              boxShadow: "none",
              border: "1px solid #e5e7eb",
              background:
                "linear-gradient(135deg, #f5f3ff, #ffffff)",
            }}
          >

            <CardContent
              sx={{
                p: 3,
              }}
            >

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 3,
                }}
              >

                <Avatar
                  sx={{
                    backgroundColor: "#ede9fe",
                    color: "#7c3aed",
                  }}
                >
                  <Psychology />
                </Avatar>

                <Box>

                  <Typography
                    variant="h6"
                    fontWeight={900}
                  >
                    AI Monitoring
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Live intelligence system
                  </Typography>

                </Box>

              </Box>


              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  backgroundColor: "#ffffff",
                  mb: 2,
                }}
              >

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >

                  <Typography
                    fontWeight={700}
                  >
                    AI System
                  </Typography>

                  <Chip
                    label="ONLINE"
                    size="small"
                    sx={{
                      backgroundColor: "#dcfce7",
                      color: "#15803d",
                      fontWeight: 900,
                    }}
                  />

                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 1,
                  }}
                >
                  Monitoring 147 animals
                </Typography>

              </Box>


              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                }}
              >

                <MiniAI
                  icon={<Visibility />}
                  value="98%"
                  label="Detection"
                />

                <MiniAI
                  icon={<Wifi />}
                  value="24"
                  label="Devices"
                />

              </Box>

            </CardContent>

          </Card>

        </Grid>

      </Grid>


      {/* =====================================================
          PRODUCTION + ALERTS
      ====================================================== */}

      <Grid
        container
        spacing={3}
        sx={{
          mb: 3,
        }}
      >

        {/* PRODUCTION */}

        <Grid
          item
          xs={12}
          md={8}
        >

          <Card
            sx={{
              borderRadius: 4,
              boxShadow: "none",
              border: "1px solid #e5e7eb",
            }}
          >

            <CardContent
              sx={{
                p: 3,
              }}
            >

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >

                <Box>

                  <Typography
                    variant="h6"
                    fontWeight={900}
                  >
                    Today's Production
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Livestock production summary
                  </Typography>

                </Box>

                <TrendingUp
                  sx={{
                    color: "#16a34a",
                    fontSize: 30,
                  }}
                />

              </Box>


              <Grid
                container
                spacing={2}
              >

                <ProductionCard
                  icon="🥛"
                  title="Milk"
                  value="402 L"
                  subtitle="+6.2% vs yesterday"
                  background="#eff6ff"
                  color="#2563eb"
                />

                <ProductionCard
                  icon="🥚"
                  title="Eggs"
                  value="1,248"
                  subtitle="+4.8% vs yesterday"
                  background="#fff7ed"
                  color="#ea580c"
                />

                <ProductionCard
                  icon="🐑"
                  title="Wool"
                  value="18.5 kg"
                  subtitle="+2.1% this week"
                  background="#f5f3ff"
                  color="#7c3aed"
                />

              </Grid>

            </CardContent>

          </Card>

        </Grid>


        {/* ALERTS */}

        <Grid
          item
          xs={12}
          md={4}
        >

          <Card
            sx={{
              height: "100%",
              borderRadius: 4,
              boxShadow: "none",
              border: "1px solid #e5e7eb",
            }}
          >

            <CardContent
              sx={{
                p: 3,
              }}
            >

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >

                  <NotificationsActive
                    sx={{
                      color: "#ea580c",
                    }}
                  />

                  <Typography
                    variant="h6"
                    fontWeight={900}
                  >
                    Alerts
                  </Typography>

                </Box>

                <Chip
                  label="5"
                  size="small"
                  sx={{
                    backgroundColor: "#ffedd5",
                    color: "#c2410c",
                    fontWeight: 900,
                  }}
                />

              </Box>


              <AlertRow
                title="Animal health warning"
                subtitle="Cow #COW024"
                color="#ef4444"
              />

              <AlertRow
                title="Vaccination due"
                subtitle="Goat #GOAT012"
                color="#f59e0b"
              />

              <AlertRow
                title="Temperature high"
                subtitle="Barn 02"
                color="#f97316"
              />

              <Button
                fullWidth
                endIcon={<ArrowForward />}
                sx={{
                  mt: 2,
                  textTransform: "none",
                  fontWeight: 800,
                }}
              >
                View All Alerts
              </Button>

            </CardContent>

          </Card>

        </Grid>

      </Grid>


      {/* =====================================================
          FARM ACTIVITY
      ====================================================== */}

      <Card
        sx={{
          borderRadius: 4,
          boxShadow: "none",
          border: "1px solid #e5e7eb",
        }}
      >

        <CardContent
          sx={{
            p: 3,
          }}
        >

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >

            <Box>

              <Typography
                variant="h6"
                fontWeight={900}
              >
                Farm Activity
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Latest activity across your farm
              </Typography>

            </Box>

            <Button
              endIcon={<ArrowForward />}
              sx={{
                textTransform: "none",
                fontWeight: 800,
              }}
            >
              View Reports
            </Button>

          </Box>


          <Grid
            container
            spacing={2}
          >

            <ActivityCard
              icon={<Pets />}
              title="Animals monitored"
              value="147"
              description="All animals are being monitored"
              color="#2563eb"
              background="#eff6ff"
            />

            <ActivityCard
              icon={<WaterDrop />}
              title="Water systems"
              value="8 / 8"
              description="All water systems operational"
              color="#0891b2"
              background="#ecfeff"
            />

            <ActivityCard
              icon={<Restaurant />}
              title="Feed systems"
              value="6 / 6"
              description="All feeding systems active"
              color="#16a34a"
              background="#f0fdf4"
            />

            <ActivityCard
              icon={<Thermostat />}
              title="Barn temperature"
              value="24°C"
              description="Optimal environment"
              color="#7c3aed"
              background="#f5f3ff"
            />

          </Grid>

        </CardContent>

      </Card>


      {/* =====================================================
          FOOTER
      ====================================================== */}

      <Box
        sx={{
          mt: 3,
          textAlign: "center",
        }}
      >

        <Typography
          variant="body2"
          color="text.secondary"
        >
          AgroLens PLF • Precision Livestock Farming
          Dashboard
        </Typography>

      </Box>

    </Box>
  );
}


/* ==========================================================
   STAT CARD
========================================================== */

function StatCard({
  title,
  value,
  subtitle,
  icon,
  background,
  iconBackground,
  iconColor,
  trend,
  alert,
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
          border: "1px solid #e5e7eb",
          height: "100%",
          backgroundColor: "#ffffff",
        }}
      >

        <CardContent
          sx={{
            p: 2.5,
          }}
        >

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >

            <Avatar
              sx={{
                width: 48,
                height: 48,
                backgroundColor:
                  iconBackground,
                color: iconColor,
              }}
            >
              {icon}
            </Avatar>


            {trend && (
              <Chip
                icon={<TrendingUp />}
                label="Up"
                size="small"
                sx={{
                  backgroundColor: "#dcfce7",
                  color: "#15803d",
                  fontWeight: 800,
                }}
              />
            )}


            {alert && (
              <Chip
                label="Attention"
                size="small"
                sx={{
                  backgroundColor: "#ffedd5",
                  color: "#c2410c",
                  fontWeight: 800,
                }}
              />
            )}

          </Box>


          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 2,
            }}
          >
            {title}
          </Typography>


          <Typography
            variant="h4"
            fontWeight={900}
            sx={{
              mt: 0.5,
            }}
          >
            {value}
          </Typography>


          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
            }}
          >
            {subtitle}
          </Typography>

        </CardContent>

      </Card>

    </Grid>
  );
}


/* ==========================================================
   HEALTH BAR
========================================================== */

function HealthBar({
  label,
  value,
  color,
}) {

  return (
    <Box
      sx={{
        mb: 2.5,
      }}
    >

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 0.8,
        }}
      >

        <Typography
          variant="body2"
          fontWeight={700}
        >
          {label}
        </Typography>

        <Typography
          variant="body2"
          fontWeight={900}
        >
          {value}%
        </Typography>

      </Box>

      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          height: 9,
          borderRadius: 10,
          backgroundColor: "#e5e7eb",

          "& .MuiLinearProgress-bar": {
            backgroundColor: color,
            borderRadius: 10,
          },
        }}
      />

    </Box>
  );
}


/* ==========================================================
   MINI AI CARD
========================================================== */

function MiniAI({
  icon,
  value,
  label,
}) {

  return (
    <Box
      sx={{
        flex: 1,
        p: 1.5,
        borderRadius: 3,
        backgroundColor: "#ffffff",
        textAlign: "center",
      }}
    >

      <Box
        sx={{
          color: "#7c3aed",
          mb: 0.5,
        }}
      >
        {icon}
      </Box>

      <Typography
        fontWeight={900}
      >
        {value}
      </Typography>

      <Typography
        variant="caption"
        color="text.secondary"
      >
        {label}
      </Typography>

    </Box>
  );
}


/* ==========================================================
   PRODUCTION CARD
========================================================== */

function ProductionCard({
  icon,
  title,
  value,
  subtitle,
  background,
  color,
}) {

  return (
    <Grid
      item
      xs={12}
      sm={4}
    >

      <Box
        sx={{
          p: 2,
          borderRadius: 3,
          backgroundColor: background,
          height: "100%",
        }}
      >

        <Typography
          sx={{
            fontSize: 30,
          }}
        >
          {icon}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 1,
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="h5"
          fontWeight={900}
          sx={{
            mt: 0.5,
            color: color,
          }}
        >
          {value}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
        >
          {subtitle}
        </Typography>

      </Box>

    </Grid>
  );
}


/* ==========================================================
   ALERT ROW
========================================================== */

function AlertRow({
  title,
  subtitle,
  color,
}) {

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1.5,
        alignItems: "center",
        py: 1.5,
      }}
    >

      <Box
        sx={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          backgroundColor: color,
          flexShrink: 0,
        }}
      />

      <Box
        sx={{
          flex: 1,
        }}
      >

        <Typography
          variant="body2"
          fontWeight={800}
        >
          {title}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
        >
          {subtitle}
        </Typography>

      </Box>

    </Box>
  );
}


/* ==========================================================
   ACTIVITY CARD
========================================================== */

function ActivityCard({
  icon,
  title,
  value,
  description,
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

      <Box
        sx={{
          p: 2,
          borderRadius: 3,
          backgroundColor: background,
          height: "100%",
        }}
      >

        <Avatar
          sx={{
            backgroundColor: "#ffffff",
            color: color,
            mb: 1.5,
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
          sx={{
            color: color,
            mt: 0.5,
          }}
        >
          {value}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
        >
          {description}
        </Typography>

      </Box>

    </Grid>
  );
}
import React from "react";
import { Grid, Card, CardContent, Typography, Box, Avatar } from "@mui/material";
import {
  Inventory2 as InventoryIcon,
  Category as CategoryIcon,
  AttachMoney as MoneyIcon,
  ReceiptLong as OrderIcon,
} from "@mui/icons-material";

export default function DashboardStats({ products = [], categories = [], orders = [] }) {
  const totalProducts = products.length;
  const totalCategories = categories.length;
  const totalValue = products.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
  const totalOrders = orders.length;
 
  const stats = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: <InventoryIcon sx={{ color: "#6366f1" }} />,
      bgColor: "rgba(99, 102, 241, 0.12)",
      borderColor: "rgba(99, 102, 241, 0.3)",
    },
    {
      title: "Categories",
      value: totalCategories,
      icon: <CategoryIcon sx={{ color: "#10b981" }} />,
      bgColor: "rgba(16, 185, 129, 0.12)",
      borderColor: "rgba(16, 185, 129, 0.3)",
    },
    {
      title: "Total Inventory Value",
      value: `Rs. ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <MoneyIcon sx={{ color: "#f59e0b" }} />,
      bgColor: "rgba(245, 158, 11, 0.12)",
      borderColor: "rgba(245, 158, 11, 0.3)",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: <OrderIcon sx={{ color: "#ec4899" }} />,
      bgColor: "rgba(236, 72, 153, 0.12)",
      borderColor: "rgba(236, 72, 153, 0.3)",
    },
  ];

  return (
    <Grid container spacing={2.5} sx={{ mb: 4 }}>
      {stats.map((stat, idx) => (
        <Grid item xs={12} sm={6} md={3} key={idx}>
          <Card
            elevation={0}
            sx={{
              background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "16px",
              transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 12px 24px rgba(0, 0, 0, 0.3)",
                borderColor: stat.borderColor,
              },
            }}
          >
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {stat.title}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#f8fafc", mt: 0.5 }}>
                    {stat.value}
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: stat.bgColor,
                    width: 48,
                    height: 48,
                    borderRadius: "12px",
                  }}
                >
                  {stat.icon}
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

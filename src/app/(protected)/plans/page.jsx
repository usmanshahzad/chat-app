"use client";

import { useChat } from "@/hooks/useChatContext";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip
} from "@mui/material";
import { useEffect, useState } from "react";

const plans = [
  {
    id: 1,
    name: "Basic",
    price: 5,
    features: ["Limited Chats", "Basic Support"],
    popular: false,
  },
  {
    id: 2,
    name: "Pro",
    price: 10,
    features: ["Unlimited Chats", "Priority Support", "Typing Indicator"],
    popular: true,
  },
  {
    id: 3,
    name: "Premium",
    price: 20,
    features: [
      "Unlimited Chats",
      "Priority Support",
      "Typing Indicator",
      "Read Receipts",
    ],
    popular: false,
  },
];

export default function PremiumPlans() {
  const { userId } = useChat();

  const handleBuy = async (plan) => {
    // console.log("Buying:", plan);

    const payload = { ...plan, userId }

    fetch("/api/checkout", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    })
        .then(res => res.json())
        .then(data => {
            window.location.href = data.url;
        })
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ textAlign: "center", mb: 4, fontWeight: "700" }}>
        Choose Your Plan
      </Typography>

      <Grid container spacing={3} sx={{ justifyContent: "center" }}>
        {plans.map((plan) => (
          <Grid item={"true"} xs={12} md={4} key={plan.id}>
            <Card
              sx={{
                position: "relative",
                p: 2,
                borderRadius: 3,
                boxShadow: plan.popular ? 6 : 2,
                border: plan.popular
                  ? "2px solid #1976d2"
                  : "1px solid #eee",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 8,
                },
              }}
            >
              {plan.popular && (
                <Chip
                  label="Most Popular"
                  color="primary"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                  }}
                />
              )}

              <CardContent>
                <Typography variant="h6" fontWeight={600}>
                  {plan.name}
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{ my: 2 }}
                >
                  ${plan.price}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  {plan.features.map((feature, i) => (
                    <Typography
                      key={i}
                      variant="body2"
                      sx={{ mb: 1 }}
                    >
                      ✔ {feature}
                    </Typography>
                  ))}
                </Box>

                <Button
                  fullWidth
                  variant={plan.popular ? "contained" : "outlined"}
                  onClick={() => handleBuy(plan)}
                >
                  Choose Plan
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
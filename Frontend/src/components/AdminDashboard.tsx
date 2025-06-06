import React, { useEffect, useState } from "react";
import API from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";
import { TrendingUp, People, TrendingDown, Download } from '@mui/icons-material';
import { Menu, MenuItem, Button } from '@mui/material';
import * as XLSX from 'xlsx';
import styles from "./Dashboard.module.css";

interface VacationStats {
  destination: string;
  followerCount: number;
}

export default function AdminDashboard() {
  const [data, setData] = useState<VacationStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    API.get("/vacations")
      .then((vacationsRes) => {
        const vacations = vacationsRes.data;
        
        API.get("/vacations/stats")
          .then((statsRes) => {
            const stats = statsRes.data;
            
            const combinedData = vacations.map((vacation: any) => {
              const stat = stats.find((s: any) => s.destination === vacation.destination);
              return {
                destination: vacation.destination,
                followerCount: stat ? stat.followerCount : 0
              };
            });

            const sortedData = combinedData.sort((a: VacationStats, b: VacationStats) => b.followerCount - a.followerCount);
            setData(sortedData);
            setLoading(false);
          })
          .catch((err) => {
            console.error("Failed to load stats:", err);
            setError("Failed to load follower statistics");
            setLoading(false);
          });
      })
      .catch((err) => {
        console.error("Failed to load vacations:", err);
        setError("Failed to load vacation data");
        setLoading(false);
      });
  }, []);

  const handleExportClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setAnchorEl(null);
  };

  const exportToCSV = () => {
    handleExportClose();
    const headers = ["Destination", "Followers Count"];
    const csvContent = [
      headers.join(","),
      ...data.map(row => [
        `"${row.destination}"`,
        row.followerCount
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `vacation-followers-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    handleExportClose();
    const headers = ["Destination", "Followers Count"];
    const rows = data.map(row => [row.destination, row.followerCount]);
    
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vacation Followers");
    
    XLSX.writeFile(workbook, `vacation-followers-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.loading}>
          Loading dashboard data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.error}>
          {error}
        </div>
      </div>
    );
  }

  const totalFollowers = data.reduce((sum, item) => sum + item.followerCount, 0);
  const averageFollowers = data.length ? Math.round(totalFollowers / data.length) : 0;
  const mostFollowed = data[0]?.followerCount || 0;
  const leastFollowed = data[data.length - 1]?.followerCount || 0;

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h2>Vacation Followers Dashboard</h2>
        <div>
          <Button
            variant="contained"
            onClick={handleExportClick}
            startIcon={<Download />}
            className={styles.exportButton}
          >
            Export Data
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleExportClose}
          >
            <MenuItem onClick={exportToCSV}>Export as CSV</MenuItem>
            <MenuItem onClick={exportToExcel}>Export as Excel</MenuItem>
          </Menu>
        </div>
      </div>

      <div className={styles.cards}>
        <div className={styles.card}>
          <h3>
            <TrendingUp /> Total Vacations
            <span className={styles.statsBadge}>Active</span>
          </h3>
          <p>{data.length}</p>
        </div>
        <div className={styles.card}>
          <h3>
            <People /> Total Followers
            <span className={styles.statsBadge}>All Time</span>
          </h3>
          <p>{totalFollowers}</p>
        </div>
        <div className={styles.card}>
          <h3>
            <TrendingDown /> Average Followers
            <span className={styles.statsBadge}>Per Vacation</span>
          </h3>
          <p>{averageFollowers}</p>
        </div>
      </div>

      {data.length > 0 && (
        <div className={styles.chartSection}>
          <h3>
            <TrendingUp /> Followers per Destination
            <span className={styles.statsBadge}>
              Most: {mostFollowed} | Least: {leastFollowed}
            </span>
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 70,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="destination" 
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
                tick={{ fill: '#666', fontSize: 12 }}
              />
              <YAxis 
                tick={{ fill: '#666', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #f0f0f0',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                formatter={(value: number) => [`${value} followers`, 'Followers']}
              />
              <Legend />
              <Bar 
                dataKey="followerCount" 
                name="Number of Followers"
                fill="#1a237e"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

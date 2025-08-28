'use client';

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  TextField,
  InputAdornment,
  Button,
} from '@mui/material';
import {
  Launch as LaunchIcon,
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { visuallyHidden } from '@mui/utils';
import useSWR from 'swr';

interface RepositoryStatsData {
  repositories: Array<{
    repoUrl: string;
    repoName: string;
    totalAudits: number;
    lastAudit: string;
    averageScore: number;
    bestScore: number;
  }>;
  totalRepositories: number;
  summary: {
    totalAudits: number;
    averageScore: number;
    topPerformer: any;
    recentlyAudited: number;
  };
}

type Order = 'asc' | 'desc';
type OrderBy = 'repoName' | 'totalAudits' | 'lastAudit' | 'averageScore' | 'bestScore';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function getScoreColor(score: number): 'success' | 'warning' | 'error' {
  if (score >= 85) return 'success';
  if (score >= 70) return 'warning';
  return 'error';
}

function getScoreGrade(score: number): string {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function RepositoryStats() {
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<OrderBy>('lastAudit');
  const [searchQuery, setSearchQuery] = useState('');

  const { 
    data: statsData, 
    error, 
    isLoading,
    mutate 
  } = useSWR<RepositoryStatsData>('/api/stats/repositories', fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
  });

  const handleRequestSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleRefresh = () => {
    mutate();
  };

  if (error) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error" gutterBottom>
          Failed to load repository statistics
        </Typography>
        <Button onClick={handleRefresh} startIcon={<RefreshIcon />}>
          Retry
        </Button>
      </Paper>
    );
  }

  if (isLoading || !statsData) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Loading repository statistics...
        </Typography>
        <LinearProgress />
      </Paper>
    );
  }

  const { repositories, summary } = statsData;

  // Filter repositories based on search query
  const filteredRepositories = repositories.filter(repo =>
    repo.repoName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    repo.repoUrl.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort repositories
  const sortedRepositories = [...filteredRepositories].sort(getComparator(order, orderBy));

  return (
    <Box>
      {/* Summary Cards */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Paper sx={{ p: 2, flex: 1, minWidth: 200 }}>
          <Typography variant="h6" color="primary">
            {summary.totalAudits}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Audits
          </Typography>
        </Paper>
        
        <Paper sx={{ p: 2, flex: 1, minWidth: 200 }}>
          <Typography variant="h6" color={getScoreColor(summary.averageScore)}>
            {summary.averageScore}/100
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Average Score
          </Typography>
        </Paper>
        
        <Paper sx={{ p: 2, flex: 1, minWidth: 200 }}>
          <Typography variant="h6" color="success.main">
            {summary.recentlyAudited}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Audited This Week
          </Typography>
        </Paper>
        
        {summary.topPerformer && (
          <Paper sx={{ p: 2, flex: 1, minWidth: 200 }}>
            <Typography variant="h6" color="success.main">
              {summary.topPerformer.repoName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Top Performer ({summary.topPerformer.bestScore}/100)
            </Typography>
          </Paper>
        )}
      </Box>

      {/* Search and Controls */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          placeholder="Search repositories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          sx={{ flexGrow: 1, maxWidth: 400 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button onClick={handleRefresh} startIcon={<RefreshIcon />} variant="outlined">
          Refresh
        </Button>
      </Box>

      {/* Repository Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'repoName'}
                  direction={orderBy === 'repoName' ? order : 'asc'}
                  onClick={() => handleRequestSort('repoName')}
                >
                  Repository
                  {orderBy === 'repoName' ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
              
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === 'totalAudits'}
                  direction={orderBy === 'totalAudits' ? order : 'asc'}
                  onClick={() => handleRequestSort('totalAudits')}
                >
                  Total Audits
                  {orderBy === 'totalAudits' ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
              
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === 'averageScore'}
                  direction={orderBy === 'averageScore' ? order : 'asc'}
                  onClick={() => handleRequestSort('averageScore')}
                >
                  Average Score
                  {orderBy === 'averageScore' ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
              
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === 'bestScore'}
                  direction={orderBy === 'bestScore' ? order : 'asc'}
                  onClick={() => handleRequestSort('bestScore')}
                >
                  Best Score
                  {orderBy === 'bestScore' ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
              
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === 'lastAudit'}
                  direction={orderBy === 'lastAudit' ? order : 'asc'}
                  onClick={() => handleRequestSort('lastAudit')}
                >
                  Last Audit
                  {orderBy === 'lastAudit' ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
              
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRepositories.map((repo) => {
              const daysSinceLastAudit = Math.floor(
                (Date.now() - new Date(repo.lastAudit).getTime()) / (1000 * 60 * 60 * 24)
              );
              
              return (
                <TableRow key={repo.repoUrl} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" noWrap>
                        {repo.repoName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {repo.repoUrl}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Chip 
                      label={repo.totalAudits} 
                      size="small" 
                      variant="outlined"
                    />
                  </TableCell>
                  
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <Chip
                        label={`${repo.averageScore}/100`}
                        color={getScoreColor(repo.averageScore)}
                        size="small"
                        variant="outlined"
                      />
                      <Typography variant="caption" color="text.secondary">
                        ({getScoreGrade(repo.averageScore)})
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <Chip
                        label={`${repo.bestScore}/100`}
                        color={getScoreColor(repo.bestScore)}
                        size="small"
                      />
                      {repo.bestScore > repo.averageScore ? (
                        <TrendingUpIcon color="success" fontSize="small" />
                      ) : repo.bestScore < repo.averageScore ? (
                        <TrendingDownIcon color="error" fontSize="small" />
                      ) : null}
                    </Box>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Box>
                      <Typography variant="body2">
                        {new Date(repo.lastAudit).toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {daysSinceLastAudit === 0 
                          ? 'Today' 
                          : daysSinceLastAudit === 1 
                          ? 'Yesterday'
                          : `${daysSinceLastAudit} days ago`
                        }
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Tooltip title="View Repository">
                      <IconButton
                        size="small"
                        component="a"
                        href={repo.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <LaunchIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        
        {sortedRepositories.length === 0 && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              {searchQuery ? 'No repositories match your search' : 'No repositories audited yet'}
            </Typography>
          </Box>
        )}
      </TableContainer>
    </Box>
  );
}
/**
 * Services index file - central export point for all API services
 */
import {login, logout, register, resetPassword} from '@/features/auth/api/authApi';;
import { isAuthenticated, getToken, fetcher, handleResponse } from '@/shared/services/apiClient';
import { getCountries, getUserTenants, getTenant, updateTenant, createTenant, switchTenant } from '@/shared/services/tenantService';
import { getIpGeolocation } from '@/shared/services/ipService';
import { 
  getProfile, 
  changePassword, 
  beginEmailVerification, 
  verifyEmailCode, 
  commitEmailVerification,
  beginEmailChange,
  verifyEmailChangeCode,
  commitEmailChange,
  storeProfile,
  fetchAndStoreProfile
} from '@/shared/services/profileService';
import {
  getTeams,
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam,
  getTeamMembers,
  addTeamMember,
  removeTeamMember
} from '@/shared/services/teamService';
import { getIndustries, getColors } from '@/shared/services/listsService';

// Re-export services
export { 
  login, logout, register, resetPassword, 
  isAuthenticated, getToken, fetcher, handleResponse,
  getCountries, getUserTenants, getTenant, updateTenant, createTenant, switchTenant,
  getIpGeolocation,
  getProfile, changePassword, beginEmailVerification, verifyEmailCode, commitEmailVerification,
  beginEmailChange, verifyEmailChangeCode, commitEmailChange,
  storeProfile, fetchAndStoreProfile,
  getTeams, getTeam, createTeam, updateTeam, deleteTeam,
  getTeamMembers, addTeamMember, removeTeamMember,
  getIndustries, getColors
};

// Export all types from models/api
export type * from '@/shared/types/api';

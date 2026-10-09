

import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, Clock, ArrowLeftIcon, FileText, Trash2, LogOut, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserProfile = ({ onLogout }) => {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState({ user: null, notes: [], loading: true });

    const handleLogout = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/logout`, {}, { withCredentials: true });
            toast.success('User Logged out');
            if (onLogout) onLogout();
            navigate('/signin', { replace: true });
        } catch (error) {
            console.error(error.message);
        }
    };

    const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';
    const formatTimeAgo = (dateString) => dateString ? new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Just now';

    useEffect(() => {
        const getUserData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user-notes`, { withCredentials: true });
                setProfileData({ user: response.data.success ? response.data.user : null, notes: response.data.success ? response.data.notes : [], loading: false });
            } catch (error) {
                console.error('Failed to get Profile', error.message);
                toast.info('Error occured while fetching profile. Try again');
                setProfileData(prev => ({ ...prev, loading: false }));
            }
        };
        getUserData();
    }, []);

    if (profileData.loading) return <div className="p-8 text-center">Loading profile...</div>;

    if (!profileData.user) {
   return <div className="p-8 text-center">Unable to load profile.</div>;
    }
    const { user, notes } = profileData;
    const totalNotes = notes?.length || 0;
    const trashItems = notes?.filter(n => n.isDeleted).length || 0;

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xl flex flex-col">
                <button type="button" onClick={() => navigate('/user_dashboard')} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors mb-4 self-start cursor-pointer">
                    <ArrowLeftIcon className="w-4 h-4" /> Back to Dashboard
                </button>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row items-center gap-5">
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full text-white bg-gradient-to-br from-purple-600 to-blue-500 border-4 border-white shadow-md flex items-center justify-center font-bold text-3xl shrink-0">
                            {user.username ? user.username.charAt(0).toUpperCase() : <User className="w-12 h-12" />}
                            <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" title="Active Session" />
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex flex-col sm:flex-row items-center gap-2">
                                {user?.username}
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200">
                                    <ShieldCheck className="w-3.5 h-3.5" /> Verified
                                </span>
                            </h1>
                            <p className="text-sm text-slate-500 flex items-center justify-center sm:justify-start gap-1.5">
                                <Mail className="w-4 h-4 text-slate-400" /> {user?.email}
                            </p>
                        </div>
                    </div>
                    <button type="button" onClick={handleLogout} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all cursor-pointer">
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>
            </div>



            {/* All crads */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-4">
                    <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl"><FileText className="w-6 h-6" /></div>
                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Total Notes
                        </h3>
                        <p className="text-2xl font-bold text-slate-900">{totalNotes}</p>
                    </div>
                </div>

                <div className="flex-1 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl"><Trash2 className="w-6 h-6" /></div>
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Trash Bin
                            </h3>
                            <p className="text-2xl font-bold text-slate-900">{trashItems}</p>
                        </div>

                    </div>
                </div>

                <div className="flex-1 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-4">
                    <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl"><Calendar className="w-6 h-6" /></div>

                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Member Since
                        </h3>
                        <p className="text-sm font-bold text-slate-900">{formatDate(user.createdAt)}</p>
                    </div>
                </div>


                <div className="flex-1 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-4">
                    <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl"><Clock className="w-6 h-6" /></div>

                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Last Login
                        </h3>
                        <p className="text-sm font-bold text-slate-900">{formatTimeAgo(user.lastLogin)}</p>
                    </div>
                </div>



            </div>


            {/* Account details showing */}
            <div className="bg-white border border-slate-200/80 rounded-3xl shadow-md p-6 flex flex-col gap-6">
                <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">Account Configuration</h2>
                <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex-1 space-y-1.5"><span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</span><div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-800">{user.username}</div></div>
                    <div className="flex-1 space-y-1.5"><span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</span><div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-800">{user.email}</div></div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
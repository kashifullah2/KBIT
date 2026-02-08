import React, { useState } from 'react';
import { Sparkles, Trophy, Heart, Activity, Briefcase, ChevronRight, AlertTriangle, Play } from 'lucide-react';

export function CareerSimulator() {
    // Game States: 'landing', 'playing', 'gameover'
    const [gameState, setGameState] = useState('landing');
    const [loading, setLoading] = useState(false);

    // Setup Data
    const [role, setRole] = useState('Product Manager');
    const [industry, setIndustry] = useState('Tech Startup');

    // Game Data
    const [gameData, setGameData] = useState({
        day: 1,
        reputation: 50,
        stress: 20,
        current_scenario: "",
        options: [],
        last_consequence: "",
        message: ""
    });

    const [userAction, setUserAction] = useState("");

    const startGame = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/career/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role, industry })
            });
            const data = await response.json();
            setGameData(data);
            setGameState('playing');
        } catch (error) {
            console.error("Failed to start game:", error);
            alert("Failed to start simulation. Ensure backend is running.");
        }
        setLoading(false);
    };

    const submitAction = async (actionText) => {
        if (!actionText) return;
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/career/act`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ state: gameData, action: actionText })
            });
            const newData = await response.json();

            if (newData.game_over) {
                setGameData(newData);
                setGameState('gameover');
            } else {
                setGameData(newData);
                setUserAction("");
            }
        } catch (error) {
            console.error("Failed to process turn:", error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto">

                {/* HEADLINE */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-4">
                        <Sparkles className="w-4 h-4" />
                        AI Career Simulator
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                        The 7-Day Challenge
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Can you survive a week in a high-pressure job without getting fired or burning out?
                    </p>
                </div>

                {/* LANDING SCREEN */}
                {gameState === 'landing' && (
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 p-8 md:p-12 text-center">
                        <div className="mb-8">
                            <Briefcase className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Choose Your Role</h2>
                            <p className="text-slate-500">Select a career path to begin your simulation.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
                            <div className="text-left">
                                <label className="block text-sm font-medium text-slate-700 mb-2">My Role</label>
                                <input
                                    type="text"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                    placeholder="e.g. Senior Developer"
                                />
                            </div>
                            <div className="text-left">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Industry / Company</label>
                                <input
                                    type="text"
                                    value={industry}
                                    onChange={(e) => setIndustry(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                    placeholder="e.g. FinTech Startup"
                                />
                            </div>
                        </div>

                        <button
                            onClick={startGame}
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transform hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Generating World...' : 'Start Career'}
                            {!loading && <Play className="w-5 h-5 fill-current" />}
                        </button>
                    </div>
                )}

                {/* GAME INTERFACE */}
                {gameState === 'playing' && (
                    <div className="grid lg:grid-cols-3 gap-6">

                        {/* STATS PANEL */}
                        <div className="lg:col-span-1 space-y-4">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-slate-800">Vital Stats</h3>
                                    <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">Day {gameData.day}/7</span>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="flex items-center gap-1.5 text-slate-600"><Trophy className="w-4 h-4 text-amber-500" /> Reputation</span>
                                            <span className="font-bold text-slate-900">{gameData.reputation}%</span>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${gameData.reputation < 30 ? 'bg-red-500' : 'bg-amber-500'}`}
                                                style={{ width: `${gameData.reputation}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="flex items-center gap-1.5 text-slate-600"><Activity className="w-4 h-4 text-blue-500" /> Stress</span>
                                            <span className="font-bold text-slate-900">{gameData.stress}%</span>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${gameData.stress > 80 ? 'bg-red-500' : 'bg-blue-500'}`}
                                                style={{ width: `${gameData.stress}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SCENARIO PANEL */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col h-full">
                                <div className="p-6 md:p-8 flex-1">
                                    {gameData.last_consequence && (
                                        <div className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-900 text-sm animate-fade-in">
                                            <strong>Last Turn:</strong> {gameData.last_consequence}
                                        </div>
                                    )}

                                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <Briefcase className="w-5 h-5 text-indigo-600" />
                                        The Situation
                                    </h3>
                                    <p className="text-lg text-slate-700 leading-relaxed mb-8">
                                        {gameData.current_scenario}
                                    </p>

                                    {/* Options or Custom Input */}
                                    <div className="space-y-3">
                                        {gameData.options && gameData.options.length > 0 ? (
                                            <div className="grid gap-3">
                                                {gameData.options.map((opt, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => submitAction(opt)}
                                                        disabled={loading}
                                                        className="text-left p-4 rounded-lg border border-slate-200 hover:border-indigo-500 hover:bg-slate-50 transition-all flex items-center justify-between group"
                                                    >
                                                        <span className="font-medium text-slate-700 group-hover:text-indigo-700">{opt}</span>
                                                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div>
                                                <textarea
                                                    value={userAction}
                                                    onChange={(e) => setUserAction(e.target.value)}
                                                    placeholder="What do you do?"
                                                    className="w-full p-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                                                />
                                                <div className="mt-4 flex justify-end">
                                                    <button
                                                        onClick={() => submitAction(userAction)}
                                                        disabled={loading || !userAction.trim()}
                                                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50"
                                                    >
                                                        {loading ? 'Thinking...' : 'Take Action'}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* GAME OVER SCREEN */}
                {gameState === 'gameover' && (
                    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center animate-scale-in">
                        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${gameData.ending === 'Victory' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'}`}>
                            {gameData.ending === 'Victory' ? <Trophy className="w-10 h-10" /> : <AlertTriangle className="w-10 h-10" />}
                        </div>

                        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
                            {gameData.ending === 'Victory' ? 'Mission Accomplished!' : 'Simulation Failed'}
                        </h2>
                        <p className="text-xl text-slate-600 mb-8">
                            {gameData.message}
                        </p>

                        <div className="bg-slate-50 rounded-xl p-6 mb-8 grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-1">Final Reputation</div>
                                <div className="text-2xl font-bold text-slate-900">{gameData.reputation}%</div>
                            </div>
                            <div>
                                <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-1">Final Stress</div>
                                <div className="text-2xl font-bold text-slate-900">{gameData.stress}%</div>
                            </div>
                        </div>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setGameState('landing')}
                                className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                            >
                                Play Again
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

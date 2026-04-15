import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Phone, Save, Check, Camera, Ticket, Calendar, MapPin } from "lucide-react";

const AVATAR_OPTIONS = [
  "🎬", "🍿", "🎭", "🎪", "🔥", "⚡", "🎯", "🦁", "🐯", "🎤", "🎸", "🏆"
];

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [saved, setSaved] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    updateProfile({ name, email, phone, avatar: selectedAvatar });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setSelectedAvatar(base64);
      setShowAvatarPicker(false);
    };
    reader.readAsDataURL(file);
  };

  const handleEmojiSelect = (emoji: string) => {
    setSelectedAvatar(emoji);
    setShowAvatarPicker(false);
  };

  const bookedSeats = (() => {
    const stored = localStorage.getItem("cinema_seats");
    if (!stored || !user) return [];
    const seats = JSON.parse(stored);
    return seats.filter((s: any) => s.bookedBy && s.bookedBy.toLowerCase().includes(user.name.toLowerCase()));
  })();

  const isImageAvatar = selectedAvatar?.startsWith("data:");

  return (
    <div className="min-h-screen cinema-gradient">
      <motion.header
        className="border-b border-border bg-card/30 backdrop-blur-md sticky top-0 z-50"
        initial={{ y: -60 }} animate={{ y: 0 }}
      >
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <motion.button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-secondary/50 rounded-lg transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <h1 className="text-xl font-bold text-gradient">My Profile</h1>
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Profile Form */}
          <motion.div
            className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                <motion.div
                  className="w-24 h-24 rounded-full bg-primary/20 border-3 border-primary flex items-center justify-center overflow-hidden cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                >
                  {isImageAvatar ? (
                    <img src={selectedAvatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : selectedAvatar ? (
                    <span className="text-4xl">{selectedAvatar}</span>
                  ) : (
                    <span className="text-3xl font-bold text-primary">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </span>
                  )}
                </motion.div>
                <motion.button
                  className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                >
                  <Camera className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Avatar Picker */}
              <AnimatePresence>
                {showAvatarPicker && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="w-full overflow-hidden"
                  >
                    <div className="bg-secondary/50 border border-border rounded-xl p-4">
                      <p className="text-xs text-muted-foreground mb-3 text-center">Choose an avatar</p>
                      <div className="grid grid-cols-6 gap-2 mb-3">
                        {AVATAR_OPTIONS.map((emoji) => (
                          <motion.button
                            key={emoji}
                            onClick={() => handleEmojiSelect(emoji)}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl hover:bg-primary/20 transition-all ${
                              selectedAvatar === emoji ? "bg-primary/30 border-2 border-primary" : "bg-card/50 border border-border"
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {emoji}
                          </motion.button>
                        ))}
                      </div>
                      <div className="border-t border-border pt-3">
                        <motion.button
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full py-2 text-sm text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-all flex items-center justify-center gap-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Camera className="w-4 h-4" />
                          Upload Photo
                        </motion.button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="text-center mt-4">
                <h2 className="text-xl font-bold">{user?.name}</h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground transition-all"
                  />
                </div>
              </div>

              <motion.button
                onClick={handleSave}
                className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg flex items-center justify-center gap-2 hover:brightness-110 transition-all glow-orange"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {saved ? (
                  <>
                    <Check className="w-4 h-4" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Booking History */}
          <motion.div
            className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-8"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-primary" />
              My Bookings
            </h3>

            {bookedSeats.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">🎟️</div>
                <p className="text-muted-foreground">No bookings yet</p>
                <motion.button
                  onClick={() => navigate("/")}
                  className="mt-4 px-6 py-2 bg-primary/20 text-primary border border-primary/30 rounded-lg text-sm hover:bg-primary/30 transition-all"
                  whileHover={{ scale: 1.05 }}
                >
                  Book Now
                </motion.button>
              </div>
            ) : (
              <div className="space-y-3">
                {bookedSeats.map((s: any, idx: number) => (
                  <motion.div
                    key={s.id}
                    className="bg-secondary/30 border border-border rounded-xl overflow-hidden"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ x: 4 }}
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold">
                            {String.fromCharCode(65 + Math.floor((s.id - 1) / 5))}{((s.id - 1) % 5) + 1}
                          </div>
                          <div>
                            <p className="font-semibold">Dhurandhar</p>
                            <p className="text-xs text-muted-foreground">
                              Row {String.fromCharCode(65 + Math.floor((s.id - 1) / 5))}, Seat {((s.id - 1) % 5) + 1}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs px-3 py-1 bg-seat-available/10 text-seat-available rounded-full border border-seat-available/30 font-medium">
                          Confirmed
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Today
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          Screen 1
                        </span>
                        <span className="flex items-center gap-1">
                          🎬 7:30 PM
                        </span>
                      </div>
                    </div>
                    <div className="border-t border-dashed border-border/50 px-4 py-2 bg-card/30 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Booked by: <span className="text-foreground font-medium">{s.bookedBy}</span></span>
                      <span className="text-xs text-primary font-medium">₹250</span>
                    </div>
                  </motion.div>
                ))}

                {/* Summary */}
                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Bookings: <span className="text-foreground font-bold">{bookedSeats.length}</span></span>
                  <span className="text-primary font-bold">Total: ₹{bookedSeats.length * 250}</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

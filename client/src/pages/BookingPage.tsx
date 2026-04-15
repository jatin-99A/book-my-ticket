import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import posterImg from "@/assets/dhurandhar-poster.png";
import { LogOut, User, Ticket, X, Check } from "lucide-react";

interface Seat {
  id: number;
  bookedBy: string | null;
}

const TOTAL_SEATS = 20;
const ROWS = 4;
const COLS = 5;

const getInitialSeats = (): Seat[] => {
  const stored = localStorage.getItem("cinema_seats");
  if (stored) return JSON.parse(stored);
  return Array.from({ length: TOTAL_SEATS }, (_, i) => ({ id: i + 1, bookedBy: null }));
};

const BookingPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [seats, setSeats] = useState<Seat[]>(getInitialSeats);
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [bookingName, setBookingName] = useState("");
  const [hoveredSeat, setHoveredSeat] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem("cinema_seats", JSON.stringify(seats));
  }, [seats]);

  const handleSeatClick = (seat: Seat) => {
    if (seat.bookedBy) return;
    setSelectedSeat(seat.id);
    setBookingName("");
  };

  const confirmBooking = () => {
    if (!bookingName.trim() || !selectedSeat) return;
    setSeats((prev) =>
      prev.map((s) => (s.id === selectedSeat ? { ...s, bookedBy: bookingName.trim() } : s))
    );
    setSelectedSeat(null);
    setBookingName("");
  };

  const myBookings = seats.filter((s) => s.bookedBy && user && s.bookedBy.toLowerCase().includes(user.name.toLowerCase()));

  return (
    <div className="min-h-screen cinema-gradient">
      {/* Header */}
      <motion.header
        className="border-b border-border bg-card/30 backdrop-blur-md sticky top-0 z-50"
        initial={{ y: -60 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gradient">ChaiCode Cinema</h1>
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 px-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm hover:bg-secondary transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {user?.avatar?.startsWith("data:") ? (
                <img src={user.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
              ) : user?.avatar ? (
                <span className="text-sm">{user.avatar}</span>
              ) : (
                <User className="w-4 h-4" />
              )}
              {user?.name}
            </motion.button>
            <motion.button
              onClick={() => { logout(); navigate("/auth"); }}
              className="p-2 text-muted-foreground hover:text-destructive transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <LogOut className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Movie Info */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="rounded-2xl overflow-hidden border border-border glow-orange">
              <img src={posterImg} alt="Dhurandhar" className="w-full aspect-[2/3] object-cover" />
            </div>
            <div className="mt-4 space-y-2">
              <h2 className="text-2xl font-bold">Dhurandhar The Revenge</h2>
              <p className="text-muted-foreground italic">"Jassi ko ghar ki yaad kyu nhi aai?"</p>
              <div className="flex gap-2 flex-wrap mt-3">
                {["Action", "Thriller", "Drama"].map((g) => (
                  <span key={g} className="px-3 py-1 text-xs rounded-full bg-primary/20 text-primary border border-primary/30">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Seats */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Screen */}
            <div className="mb-8 text-center">
              <div className="mx-auto w-3/4 h-2 bg-gradient-to-r from-transparent via-primary/60 to-transparent rounded-full mb-2" />
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Screen</p>
            </div>

            {/* Seat Grid */}
            <div className="flex flex-col items-center gap-3">
              {Array.from({ length: ROWS }, (_, row) => (
                <motion.div
                  key={row}
                  className="flex gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + row * 0.1 }}
                >
                  <span className="w-6 flex items-center justify-center text-xs text-muted-foreground font-medium">
                    {String.fromCharCode(65 + row)}
                  </span>
                  {Array.from({ length: COLS }, (_, col) => {
                    const seatIdx = row * COLS + col;
                    const seat = seats[seatIdx];
                    const isBooked = !!seat.bookedBy;
                    const isSelected = selectedSeat === seat.id;
                    const isHovered = hoveredSeat === seat.id;

                    return (
                      <div key={seat.id} className="relative">
                        <motion.button
                          onClick={() => handleSeatClick(seat)}
                          onMouseEnter={() => setHoveredSeat(seat.id)}
                          onMouseLeave={() => setHoveredSeat(null)}
                          className={`w-14 h-14 rounded-lg flex items-center justify-center text-sm font-semibold transition-all border-2 ${
                            isBooked
                              ? "bg-destructive/20 border-destructive/50 text-destructive cursor-not-allowed"
                              : isSelected
                              ? "bg-primary/30 border-primary text-primary glow-orange"
                              : "bg-seat-available/10 border-seat-available/40 text-seat-available hover:bg-seat-available/20 hover:border-seat-available cursor-pointer"
                          }`}
                          whileHover={!isBooked ? { scale: 1.1, y: -2 } : {}}
                          whileTap={!isBooked ? { scale: 0.95 } : {}}
                        >
                          {String.fromCharCode(65 + row)}{col + 1}
                        </motion.button>

                        {/* Tooltip for booked seat */}
                        <AnimatePresence>
                          {isHovered && isBooked && seat.bookedBy && (
                            <motion.div
                              initial={{ opacity: 0, y: 5, scale: 0.9 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 5, scale: 0.9 }}
                              className="absolute -top-12 left-1/2 -translate-x-1/2 bg-card border border-border rounded-lg px-3 py-1.5 text-xs whitespace-nowrap z-50 shadow-xl"
                            >
                              <span className="text-muted-foreground">Booked by: </span>
                              <span className="font-semibold text-foreground">{seat.bookedBy}</span>
                              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-card border-r border-b border-border rotate-45" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </motion.div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-8">
              {[
                { label: "Available", cls: "bg-seat-available/20 border-seat-available/50" },
                { label: "Booked", cls: "bg-destructive/20 border-destructive/50" },
                { label: "Selected", cls: "bg-primary/30 border-primary" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className={`w-5 h-5 rounded border-2 ${l.cls}`} />
                  {l.label}
                </div>
              ))}
            </div>

            {/* Booking Input - inline below seats */}
            <AnimatePresence>
              {selectedSeat !== null && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-8 overflow-hidden"
                >
                  <div className="bg-card/70 backdrop-blur-xl border border-primary/30 rounded-2xl p-6 glow-orange">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Ticket className="w-5 h-5 text-primary" />
                        <h3 className="font-bold text-lg">
                          Book Seat {String.fromCharCode(65 + Math.floor((selectedSeat - 1) / COLS))}
                          {((selectedSeat - 1) % COLS) + 1}
                        </h3>
                      </div>
                      <motion.button
                        onClick={() => setSelectedSeat(null)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        whileHover={{ scale: 1.1 }}
                      >
                        <X className="w-5 h-5" />
                      </motion.button>
                    </div>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Enter your name"
                        value={bookingName}
                        onChange={(e) => setBookingName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && confirmBooking()}
                        autoFocus
                        className="flex-1 px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                      />
                      <motion.button
                        onClick={confirmBooking}
                        disabled={!bookingName.trim()}
                        className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg flex items-center gap-2 hover:brightness-110 transition-all disabled:opacity-40"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Check className="w-4 h-4" />
                        Confirm
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* My Bookings */}
            {myBookings.length > 0 && (
              <motion.div
                className="mt-8 bg-card/50 border border-border rounded-2xl p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-primary" />
                  Your Bookings
                </h3>
                <div className="flex flex-wrap gap-2">
                  {myBookings.map((s) => (
                    <span key={s.id} className="px-3 py-1.5 bg-primary/20 text-primary border border-primary/30 rounded-lg text-sm font-medium">
                      Seat {String.fromCharCode(65 + Math.floor((s.id - 1) / COLS))}{((s.id - 1) % COLS) + 1}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;

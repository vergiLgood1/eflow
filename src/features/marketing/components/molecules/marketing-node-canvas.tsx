"use client";

import { motion } from "framer-motion";
import { Database, Link2, Table2 } from "lucide-react";

interface Column {
  name: string;
  type: string;
  isPk?: boolean;
  isFk?: boolean;
}

interface TableNodeProps {
  name: string;
  columns: Column[];
  x: number;
  y: number;
  delay?: number;
  color?: string;
}

const TableNode = ({ name, columns, x, y, delay = 0, color = "var(--primary)" }: TableNodeProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, x: x - 20, y: y - 20 }}
      animate={{
        opacity: 1,
        scale: 1,
        x,
        y: [y, y - 10, y],
      }}
      transition={{
        opacity: { duration: 0.8, delay },
        scale: { duration: 0.8, delay },
        x: { duration: 0.8, delay },
        y: {
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay + 0.5
        }
      }}
      className="absolute w-[210px] rounded-xl border border-white/10 bg-card/40 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden pointer-events-none group"
      style={{ left: 0, top: 0, boxShadow: `0 10px 30px -10px ${color}20` }}
    >
      {/* Glossy Header */}
      <div 
        className="relative flex h-9 items-center gap-2 px-3 text-white font-bold text-[11px] overflow-hidden"
        style={{ background: `linear-gradient(to right, ${color}cc, ${color}44)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
        <div className="relative flex items-center justify-center w-5 h-5 rounded bg-white/10 ring-1 ring-white/20">
          <Table2 className="h-3 w-3" />
        </div>
        <span className="relative truncate uppercase tracking-[0.1em]">{name}</span>
        
        {/* Status Dot */}
        <div className="ml-auto flex items-center gap-1.5 bg-black/20 px-1.5 py-0.5 rounded-full ring-1 ring-white/5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
          <span className="text-[8px] opacity-70">LIVE</span>
        </div>
      </div>

      {/* Columns List */}
      <div className="py-1.5 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
        {columns.map((col, i) => (
          <div 
            key={i} 
            className="group/row flex items-center gap-2.5 px-3 py-1.5 text-[10px] border-b border-white/[0.03] last:border-0 hover:bg-white/[0.03] transition-colors"
          >
            <span className="flex h-4 w-4 items-center justify-center shrink-0">
              {col.isPk && (
                <div className="relative">
                  <span className="text-primary text-[9px] font-black tracking-tighter">PK</span>
                  <div className="absolute inset-0 blur-[4px] bg-primary/40" />
                </div>
              )}
              {col.isFk && <Link2 className="h-3 w-3 text-sky-400/80" />}
            </span>
            <span className="flex-1 truncate font-medium text-foreground/90 group-hover/row:text-white transition-colors">{col.name}</span>
            <span className="text-[9px] text-muted-foreground/50 font-mono italic group-hover/row:text-muted-foreground transition-colors">{col.type}</span>
          </div>
        ))}
      </div>

      {/* Bottom Action Bar (Mock) */}
      <div className="h-7 border-t border-white/5 bg-black/20 flex items-center justify-between px-3">
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
        </div>
        <div className="h-3 w-8 rounded-sm bg-white/5" />
      </div>
    </motion.div>
  );
};

const ConnectionLine = ({ 
  from, 
  to, 
  delay = 0, 
  labelStart = "1", 
  labelEnd = "*" 
}: { 
  from: { x: number, y: number }, 
  to: { x: number, y: number }, 
  delay?: number,
  labelStart?: string,
  labelEnd?: string
}) => {
  const midX = (from.x + to.x) / 2;
  const path = `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" style={{ zIndex: 5 }}>
      {/* Glow Path */}
      <motion.path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        className="text-primary/10 blur-[3px]"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2, delay, ease: "easeInOut" }}
      />
      
      {/* Main Path */}
      <motion.path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-primary/40"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay, ease: "easeInOut" }}
      />

      {/* Cardinality Labels */}
      <motion.text
        x={from.x + 10}
        y={from.y - 10}
        fill="currentColor"
        className="text-primary/60 font-mono text-[9px] font-bold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 1.5 }}
      >
        {labelStart}
      </motion.text>
      <motion.text
        x={to.x - 15}
        y={to.y - 10}
        fill="currentColor"
        className="text-primary/60 font-mono text-[9px] font-bold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 1.5 }}
      >
        {labelEnd}
      </motion.text>

      {/* Pulsing Particle */}
      <motion.circle
        r="3"
        fill="white"
        className="shadow-[0_0_10px_white]"
        initial={{ offset: 0, opacity: 0 }}
        animate={{
          opacity: [0, 1, 0],
          offset: 1
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay + 2
        }}
      >
        <animateMotion dur="3.5s" repeatCount="indefinite" path={path} />
      </motion.circle>
    </svg>
  );
};

const BackgroundBlob = ({ color, x, y, size, duration }: { color: string, x: string, y: string, size: string, duration: number }) => (
  <motion.div
    animate={{
      x: ["0%", "5%", "-5%", "0%"],
      y: ["0%", "8%", "-8%", "0%"],
      scale: [1, 1.1, 0.9, 1],
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    className="absolute blur-[120px] rounded-full opacity-20 pointer-events-none"
    style={{
      backgroundColor: color,
      left: x,
      top: y,
      width: size,
      height: size,
    }}
  />
);

export const MarketingNodeCanvas = () => {
  return (
    <div className="relative w-full h-full bg-[#050505] overflow-hidden">
      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Ambient Movement */}
      <BackgroundBlob color="var(--primary)" x="10%" y="10%" size="400px" duration={15} />
      <BackgroundBlob color="#0ea5e9" x="60%" y="40%" size="350px" duration={20} />
      <BackgroundBlob color="#8b5cf6" x="30%" y="70%" size="300px" duration={18} />

      {/* Nodes */}
      <TableNode
        name="users"
        x={180}
        y={160}
        delay={0.2}
        color="#3b82f6"
        columns={[
          { name: "id", type: "uuid", isPk: true },
          { name: "email", type: "varchar" },
          { name: "full_name", type: "text" },
          { name: "avatar_url", type: "text" },
          { name: "created_at", type: "timestamp" },
        ]}
      />

      <TableNode
        name="orders"
        x={460}
        y={260}
        delay={0.4}
        color="#8b5cf6"
        columns={[
          { name: "id", type: "uuid", isPk: true },
          { name: "user_id", type: "uuid", isFk: true },
          { name: "amount", type: "decimal" },
          { name: "status", type: "enum" },
          { name: "ordered_at", type: "timestamp" },
        ]}
      />

      <TableNode
        name="products"
        x={760}
        y={150}
        delay={0.6}
        color="#0ea5e9"
        columns={[
          { name: "id", type: "uuid", isPk: true },
          { name: "sku", type: "varchar" },
          { name: "name", type: "varchar" },
          { name: "price", type: "decimal" },
          { name: "stock", type: "integer" },
        ]}
      />

      <TableNode
        name="order_items"
        x={790}
        y={400}
        delay={0.8}
        color="#f43f5e"
        columns={[
          { name: "id", type: "uuid", isPk: true },
          { name: "order_id", type: "uuid", isFk: true },
          { name: "product_id", type: "uuid", isFk: true },
          { name: "quantity", type: "integer" },
        ]}
      />

      {/* Connections */}
      <ConnectionLine from={{ x: 390, y: 185 }} to={{ x: 460, y: 300 }} delay={1.2} labelStart="1" labelEnd="*" />
      <ConnectionLine from={{ x: 670, y: 290 }} to={{ x: 790, y: 440 }} delay={1.4} labelStart="1" labelEnd="n" />
      <ConnectionLine from={{ x: 970, y: 175 }} to={{ x: 1000, y: 450 }} delay={1.6} labelStart="1" labelEnd="1" />

      {/* Decorative Floating Icon (Optional Flair) */}
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 right-20 text-white/5 opacity-50"
      >
        <Database size={120} strokeWidth={0.5} />
      </motion.div>
    </div>
  );
};

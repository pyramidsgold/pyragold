
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  LayoutDashboard, LogOut, Settings as SettingsIcon, 
  Users, Beaker, ShoppingCart, Banknote, Scale, 
  Printer, Save, History, TrendingUp, UserCircle, Lock,
  FileText, Calculator, BadgePercent, Truck, Plus, Trash2, Briefcase, MapPin, Shield, Database, RotateCcw, Upload, FileSpreadsheet, Edit, PieChart, Landmark,
  Wifi, WifiOff, Globe, TrendingDown, Info, Monitor, Play, Square
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RePieChart, Pie, Cell } from 'recharts';
import { User, UserRole, Transaction, Settings as SettingsType, Employee, TransactionType, Partner, Permission } from './types';
import { storage } from './services/storage';
import { GoldCard, Button, Input, Select } from './components/UI';

// --- UTILS ---
const exportToCSV = (data: any[], filename: string) => {
  if (!data || !data.length) {
    alert('لا توجد بيانات للتصدير');
    return;
  }
  // Create BOM for Arabic support
  const BOM = "\uFEFF";
  const headers = Object.keys(data[0]).join(",");
  const rows = data.map(obj => Object.values(obj).map(val => `"${val}"`).join(",")).join("\n");
  const csvContent = BOM + headers + "\n" + rows;
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// --- COMPONENTS ---

// 0. Animated 3D Logo
const AnimatedLogo = ({ size = "large" }: { size?: "small" | "large" }) => {
  const isLarge = size === "large";
  return (
    <div className={`relative flex items-center justify-center ${isLarge ? 'w-40 h-40' : 'w-12 h-12'} perspective-1000`}>
      {/* Styles for the 3D Pyramid */}
      <style>{`
        @keyframes rotatePyramid {
          0% { transform: rotateY(0deg) rotateX(15deg); }
          100% { transform: rotateY(360deg) rotateX(15deg); }
        }
        .pyramid-container {
          transform-style: preserve-3d;
          animation: rotatePyramid 8s linear infinite;
          width: 100%;
          height: 100%;
          position: relative;
        }
        .side {
          position: absolute;
          width: 0;
          height: 0;
          border-left: ${isLarge ? '50px' : '15px'} solid transparent;
          border-right: ${isLarge ? '50px' : '15px'} solid transparent;
          border-bottom: ${isLarge ? '100px' : '30px'} solid rgba(255, 215, 0, 0.8);
          transform-origin: 50% 100%;
        }
        .side-1 { transform: translateZ(${isLarge ? '28px' : '8px'}) rotateX(30deg); border-bottom-color: #FFD700; }
        .side-2 { transform: rotateY(90deg) translateZ(${isLarge ? '28px' : '8px'}) rotateX(30deg); border-bottom-color: #FDB813; }
        .side-3 { transform: rotateY(180deg) translateZ(${isLarge ? '28px' : '8px'}) rotateX(30deg); border-bottom-color: #B8860B; }
        .side-4 { transform: rotateY(-90deg) translateZ(${isLarge ? '28px' : '8px'}) rotateX(30deg); border-bottom-color: #DAA520; }
        .base {
          position: absolute;
          width: ${isLarge ? '100px' : '30px'};
          height: ${isLarge ? '100px' : '30px'};
          background: #B8860B;
          transform: rotateX(90deg) translateZ(${isLarge ? '-30px' : '-10px'});
          box-shadow: 0 0 40px rgba(255, 215, 0, 0.6);
        }
      `}</style>
      
      <div className="pyramid-container">
        <div className="side side-1 flex items-end justify-center"><div className={`text-black font-black ${isLarge ? 'text-xs pb-4' : 'text-[4px] pb-1'}`}>PG</div></div>
        <div className="side side-2"></div>
        <div className="side side-3"></div>
        <div className="side side-4"></div>
        <div className="base"></div>
      </div>
    </div>
  );
};

// 1. Login Screen
const LoginScreen = ({ onLogin }: { onLogin: (u: User) => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const users = storage.getUsers();
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      onLogin({ ...user, lastLogin: new Date().toISOString() });
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] overflow-hidden relative font-sans">
      {/* Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-[128px]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[128px]"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gold-500/20 blur-xl rounded-full"></div>
            <AnimatedLogo size="large" />
          </div>
        </div>
        
        <GoldCard className="text-center border-gold-500/30 backdrop-blur-sm bg-black/60">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-500 to-gold-200 mb-2 tracking-tight">
            بيراميدز جولد
          </h1>
          <p className="text-zinc-400 mb-8 text-sm tracking-wide uppercase">نظام إدارة معامل الذهب المتكامل</p>
          
          <form onSubmit={handleLogin} className="text-right space-y-4">
            <Input 
              label="اسم المستخدم" 
              value={username} 
              onChange={e => setUsername(e.target.value)}
              placeholder="أدخل اسم المستخدم"
              className="bg-black/50 border-zinc-800 focus:border-gold-500"
            />
            <Input 
              label="كلمة المرور" 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              placeholder="********"
              className="bg-black/50 border-zinc-800 focus:border-gold-500"
            />
            {error && <p className="text-red-500 text-sm font-bold text-center bg-red-900/10 py-2 rounded border border-red-900/30 animate-pulse">{error}</p>}
            <Button type="submit" className="w-full mt-6 py-3 text-lg group overflow-hidden relative">
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Lock className="w-5 h-5 group-hover:scale-110 transition-transform" />
                تسجيل الدخول
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-gold-400 via-white/50 to-gold-400 opacity-0 group-hover:opacity-20 transform -translate-x-full group-hover:translate-x-full transition-all duration-700"></div>
            </Button>
          </form>
        </GoldCard>
        <p className="text-center text-zinc-600 text-xs mt-8 tracking-widest uppercase">
          &copy; 2025 Pyramids Gold Systems v2.0
        </p>
      </div>
    </div>
  );
};

// 2. Dashboard Component
const Dashboard = ({ transactions, settings }: { transactions: Transaction[], settings: SettingsType }) => {
  const stats = useMemo(() => {
    const totalSales = transactions.filter(t => t.type === 'SELL').reduce((sum, t) => sum + t.totalAmount, 0);
    const totalPurchases = transactions.filter(t => t.type === 'BUY').reduce((sum, t) => sum + t.totalAmount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.totalAmount, 0);
    const totalAnalysisRevenue = transactions.filter(t => t.type === 'ANALYSIS').reduce((sum, t) => sum + t.totalAmount, 0);
    const analysisCount = transactions.filter(t => t.type === 'ANALYSIS').length;
    
    // Net Profit Logic with Analysis Revenue
    const grossProfit = totalSales - totalPurchases;
    const operatingProfit = grossProfit + totalAnalysisRevenue - totalExpenses;
    const tax23 = operatingProfit > 0 ? operatingProfit * 0.23 : 0;
    const vat14 = operatingProfit > 0 ? operatingProfit * 0.14 : 0;
    const netProfit = operatingProfit - tax23 - vat14;

    // Inventory Logic
    let currentPureWeight = 0;
    transactions.forEach(t => {
      if ((t.type === 'BUY' || t.type === 'SELL') && t.weight && t.karat) {
         const purity = t.karat / 1000;
         const pureContent = t.weight * purity;
         if (t.type === 'BUY') currentPureWeight += pureContent;
         if (t.type === 'SELL') currentPureWeight -= pureContent;
      }
    });
    
    const currentPrice24 = settings.goldPrice24 || 0;
    const stockValue = currentPureWeight * currentPrice24;

    const chartData = [
      { name: 'السبت', sales: totalSales * 0.15, buy: totalPurchases * 0.2 },
      { name: 'الأحد', sales: totalSales * 0.2, buy: totalPurchases * 0.1 },
      { name: 'الاثنين', sales: totalSales * 0.1, buy: totalPurchases * 0.15 },
      { name: 'الثلاثاء', sales: totalSales * 0.25, buy: totalPurchases * 0.25 },
      { name: 'الأربعاء', sales: totalSales * 0.15, buy: totalPurchases * 0.1 },
      { name: 'الخميس', sales: totalSales * 0.1, buy: totalPurchases * 0.15 },
      { name: 'الجمعة', sales: totalSales * 0.05, buy: totalPurchases * 0.05 },
    ];

    return { totalSales, totalPurchases, totalExpenses, totalAnalysisRevenue, analysisCount, chartData, netProfit, currentPureWeight, stockValue };
  }, [transactions, settings]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Carousel / Hero Section */}
      <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl border border-gold-500/30 group isolate">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 bg-zinc-900">
          <img 
            src="https://images.unsplash.com/photo-1605218427368-35b8113d18be?q=80&w=2000&auto=format&fit=crop" 
            alt="Gold Vault" 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70"
          />
          {/* Gradient Overlay for Depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-gold-900/10 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        </div>
        
        {/* Content */}
        <div className="absolute inset-0 flex items-center p-10 z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-300 text-xs font-bold mb-4 backdrop-blur-sm">
              <Shield className="w-3 h-3" /> النظام الآمن لإدارة المعامل
            </div>
            <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-400 to-gold-100 drop-shadow-sm mb-4 leading-tight">
              بيراميدز جولد
            </h2>
            <p className="text-white/80 text-lg leading-relaxed max-w-lg border-r-4 border-gold-500 pr-4">
              الحل المتكامل لإدارة عمليات التحليل، البيع، والشراء في أسواق الذهب والمعادن الثمينة بأحدث التقنيات.
            </p>
            <div className="mt-8 flex gap-4">
               <Button className="shadow-gold-glow/50">ابدأ العمل</Button>
               <Button variant="secondary" className="backdrop-blur-sm bg-white/5 hover:bg-white/10">التقارير السريعة</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory / Stock Section */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <div className="bg-gradient-to-r from-zinc-900 to-black border border-gold-500/30 rounded-xl p-6 relative overflow-hidden shadow-gold-glow group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 transition-all duration-700 group-hover:bg-gold-500/20"></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center gap-6 mb-4 md:mb-0">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/30">
                        <Scale className="w-10 h-10 text-black" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white">رصيد المخزون الحالي</h2>
                        <p className="text-gold-300/80 mt-1">إجمالي الذهب الخالص (عيار 24) المتوفر في الخزنة</p>
                    </div>
                </div>
                <div className="flex gap-12 text-center md:text-right">
                    <div>
                        <div className="text-zinc-500 text-sm font-bold mb-1 uppercase tracking-wider">الوزن الصافي</div>
                        <div className="text-5xl font-black text-gold-400 font-mono drop-shadow-md">
                            {stats.currentPureWeight.toFixed(2)} <span className="text-lg text-zinc-500 font-sans font-bold">جم</span>
                        </div>
                    </div>
                    <div className="hidden md:block w-px bg-white/10 h-16 self-center"></div>
                    <div>
                        <div className="text-zinc-500 text-sm font-bold mb-1 uppercase tracking-wider">القيمة السوقية</div>
                        <div className="text-4xl font-bold text-white font-mono">
                            {Math.floor(stats.stockValue).toLocaleString()} <span className="text-sm text-gold-500 font-sans font-bold">{settings.currency}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GoldCard title="إجمالي المبيعات" icon={<TrendingUp />}>
          <div className="text-2xl font-black text-white">
            {stats.totalSales.toLocaleString()} <span className="text-xs text-gold-500 font-normal">{settings.currency}</span>
          </div>
        </GoldCard>
        <GoldCard title="إجمالي المشتريات" icon={<ShoppingCart />}>
          <div className="text-2xl font-black text-white">
            {stats.totalPurchases.toLocaleString()} <span className="text-xs text-gold-500 font-normal">{settings.currency}</span>
          </div>
        </GoldCard>
        <GoldCard title="عائد التحليل" icon={<Beaker />}>
           <div className="text-2xl font-black text-blue-400">
             {stats.totalAnalysisRevenue.toLocaleString()} <span className="text-xs text-blue-200 font-normal">{settings.currency}</span>
           </div>
           <div className="text-[10px] text-zinc-500 mt-1">{stats.analysisCount} عملية فحص</div>
        </GoldCard>
         <GoldCard title="صافي الأرباح" icon={<PieChart />}>
          <div className={`text-2xl font-black ${stats.netProfit >= 0 ? 'text-green-400' : 'text-red-500'}`}>
            {Math.floor(stats.netProfit).toLocaleString()} <span className="text-xs text-zinc-400 font-normal">{settings.currency}</span>
          </div>
          <div className="text-[10px] text-zinc-500 mt-1">شامل عوائد التحليل وخصم الضرائب</div>
        </GoldCard>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GoldCard title="حركة البيع والشراء" className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#d4af37', color: '#fff' }}
              />
              <Bar dataKey="sales" name="مبيعات" fill="#fbbf24" radius={[4, 4, 0, 0]} />
              <Bar dataKey="buy" name="مشتريات" fill="#52525b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GoldCard>
         <GoldCard title="تحليل الأداء" className="h-80">
           <div className="flex items-center justify-center h-full text-zinc-500">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#d4af37' }} />
                  <Line type="monotone" dataKey="sales" stroke="#fbbf24" strokeWidth={3} dot={{fill: '#fbbf24'}} />
                </LineChart>
              </ResponsiveContainer>
           </div>
        </GoldCard>
      </div>
    </div>
  );
};

// 3. Operations Component (Buy/Sell/Analysis)
const OperationForm = ({ 
  type, 
  settings, 
  onSave 
}: { 
  type: TransactionType, 
  settings: SettingsType, 
  onSave: (t: Transaction) => void 
}) => {
  const [formData, setFormData] = useState<Partial<Transaction>>({
    date: new Date().toISOString().split('T')[0],
    weight: 0,
    karat: 875, // Default to 21k fineness
    pricePerGram: 0,
    customerName: '',
    discount: 0,
    isPaid: true
  });

  useEffect(() => {
    if (type === 'SELL' || type === 'BUY') {
      let price = 0;
      // Calculate based on goldPrice24 and fineness (per 1000)
      // Formula: (Base24Price / 1000) * Fineness
      if (settings.goldPrice24) {
        price = (settings.goldPrice24 / 1000) * (formData.karat || 0);
      }

      if (type === 'SELL') price += 50; 
      if (type === 'BUY') price -= 50;

      setFormData(prev => ({ ...prev, pricePerGram: Math.round(price) }));
    }
  }, [formData.karat, type, settings]);

  const total = useMemo(() => {
    const raw = (formData.weight || 0) * (formData.pricePerGram || 0);
    // Discount is now Percentage
    const discountAmount = (raw * (formData.discount || 0)) / 100;
    return raw - discountAmount;
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: Date.now().toString(),
      type,
      totalAmount: total,
      isPaid: true,
      ...formData
    } as Transaction);
    alert('تم حفظ العملية بنجاح!');
    setFormData({ ...formData, weight: 0, customerName: '', discount: 0, details: {} });
  };

  const getTitle = () => {
    switch(type) {
      case 'BUY': return 'تسجيل شراء ذهب';
      case 'SELL': return 'تسجيل بيع ذهب';
      case 'ANALYSIS': return 'تسجيل فحص جديد';
      default: return '';
    }
  };

  return (
    <GoldCard title={getTitle()} icon={<Scale />}>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input 
          label={type === 'ANALYSIS' ? "اسم العميل / المصدر" : "اسم العميل"} 
          value={formData.customerName}
          onChange={e => setFormData({...formData, customerName: e.target.value})}
          required
        />
        <Input 
          label="التاريخ" 
          type="date" 
          value={formData.date}
          onChange={e => setFormData({...formData, date: e.target.value})}
          required
        />
        
        <div className="col-span-2 border-t border-white/10 my-2"></div>

        <Input 
          label="الوزن (جرام)" 
          type="number" step="0.01"
          value={formData.weight}
          onChange={e => setFormData({...formData, weight: parseFloat(e.target.value)})}
          required
        />

        {type !== 'ANALYSIS' && (
           <Input 
             label="العيار (سهم / 1000)"
             type="number"
             placeholder="مثال: 875"
             value={formData.karat}
             onChange={e => setFormData({...formData, karat: parseFloat(e.target.value)})}
             required
           />
        )}

        {type === 'ANALYSIS' && (
           <Select 
             label="نوع السبيكة"
             value={formData.details?.type || 'cast'}
             onChange={e => setFormData({...formData, details: {...formData.details, type: e.target.value}})}
           >
             <option value="cast">سبك (Cast)</option>
             <option value="raw">غير مسبوك (Raw)</option>
           </Select>
        )}

        {type !== 'ANALYSIS' && (
          <>
            <Input 
              label="سعر الجرام (محسوب)" 
              type="number" 
              value={formData.pricePerGram}
              onChange={e => setFormData({...formData, pricePerGram: parseFloat(e.target.value)})}
            />
             <Input 
              label="نسبة الخصم (%)" 
              type="number"
              max="100"
              value={formData.discount}
              onChange={e => setFormData({...formData, discount: parseFloat(e.target.value)})}
            />
          </>
        )}

        {type === 'ANALYSIS' && (
          <Input 
            label="تكلفة الفحص" 
            type="number" 
            value={formData.pricePerGram}
            onChange={e => setFormData({...formData, pricePerGram: parseFloat(e.target.value)})}
          />
        )}

        <div className="col-span-2 bg-zinc-900 p-4 rounded-lg border border-gold-500/30 flex justify-between items-center">
          <span className="text-xl font-bold text-zinc-400">الإجمالي النهائي:</span>
          <span className="text-3xl font-black text-gold-400">{type === 'ANALYSIS' ? formData.pricePerGram : total.toLocaleString()} {settings.currency}</span>
        </div>

        <div className="col-span-2 flex gap-4 mt-4">
          <Button type="submit" className="flex-1">
             <Save className="w-5 h-5" />
             حفظ وطباعة الفاتورة
          </Button>
          <Button type="button" variant="secondary" onClick={() => window.print()}>
             <Printer className="w-5 h-5" />
             معاينة الطباعة
          </Button>
        </div>
      </form>
    </GoldCard>
  );
};

// 4. Pricing Calculator
const PricingCalculator = ({ settings }: { settings: SettingsType }) => {
  const [weight, setWeight] = useState(0);
  const [karat, setKarat] = useState(0);
  
  const pureWeight = (weight * karat) / 1000;
  const calculatedPrice = (weight * (karat / 1000)) * (settings.goldPrice24);

  return (
    <GoldCard title="حاسبة تحيف الذهب (Pricing)" icon={<Calculator />}>
      <div className="space-y-6">
         <div className="grid grid-cols-2 gap-4">
            <Input 
              label="وزن السبيكة (جرام)"
              type="number"
              value={weight}
              onChange={e => setWeight(parseFloat(e.target.value))}
            />
            <Input 
              label="العيار (من 1000)"
              placeholder="مثال: 875"
              type="number"
              value={karat}
              onChange={e => setKarat(parseFloat(e.target.value))}
            />
         </div>
         <div className="p-6 bg-zinc-800 rounded-xl border-2 border-gold-500/50 text-center space-y-4">
            <div>
              <div className="text-zinc-400 text-sm mb-1">الوزن الصافي (ذهب خالص)</div>
              <div className="text-2xl font-bold text-white">{pureWeight.toFixed(3)} جم</div>
            </div>
            <div className="border-t border-white/10 pt-4">
              <div className="text-zinc-400 text-sm mb-1">السعر التقديري</div>
              <div className="text-4xl font-black text-gold-400">{Math.round(calculatedPrice).toLocaleString()} EGP</div>
            </div>
         </div>
      </div>
    </GoldCard>
  )
}

// 5. Expenses Component
const ExpensesView = ({ settings, onSave }: { settings: SettingsType, onSave: (t: Transaction) => void }) => {
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('مصاريف أخرى');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: Date.now().toString(),
      type: 'EXPENSE',
      totalAmount: amount,
      description,
      details: { category },
      date,
      isPaid: true
    } as Transaction);
    setAmount(0);
    setDescription('');
    alert('تم تسجيل المصروف');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <GoldCard title="تسجيل مصروف جديد" icon={<Banknote />}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select label="نوع المصروف" value={category} onChange={e => setCategory(e.target.value)}>
            <option value="رواتب">رواتب موظفين</option>
            <option value="إيجار">إيجار</option>
            <option value="كهرباء">كهرباء ومياه</option>
            <option value="ضيافة">ضيافة ونثريات</option>
            <option value="مصاريف أخرى">مصاريف أخرى</option>
          </Select>
          <Input label="المبلغ" type="number" value={amount} onChange={e => setAmount(parseFloat(e.target.value))} required />
          <Input label="الوصف / ملاحظات" value={description} onChange={e => setDescription(e.target.value)} />
          <Input label="التاريخ" type="date" value={date} onChange={e => setDate(e.target.value)} required />
          <Button type="submit" variant="danger" className="w-full mt-4">تسجيل المصروف</Button>
        </form>
      </GoldCard>
      <div className="bg-gradient-to-br from-zinc-900 to-black rounded-xl p-6 border border-white/10 flex items-center justify-center">
         <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-red-900/30 flex items-center justify-center mx-auto mb-4">
               <Banknote className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-white">إدارة المصروفات</h3>
            <p className="text-zinc-500 mt-2">يتم خصم جميع المصروفات من الأرباح الصافية في التقارير</p>
         </div>
      </div>
    </div>
  );
};

// 6. Employees Component
const EmployeesView = () => {
  const [employees, setEmployees] = useState<Employee[]>(storage.getEmployees());
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [empForm, setEmpForm] = useState<Partial<Employee>>({});

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      storage.updateEmployee({ ...empForm, id: editingId } as Employee);
    } else {
      storage.addEmployee({ ...empForm, id: Date.now().toString() } as Employee);
    }
    setEmployees(storage.getEmployees());
    setShowForm(false);
    setEditingId(null);
    setEmpForm({});
  };

  const handleEdit = (emp: Employee) => {
    setEditingId(emp.id);
    setEmpForm(emp);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الموظف؟')) {
      storage.deleteEmployee(id);
      setEmployees(storage.getEmployees());
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold text-gold-100">إدارة الموظفين</h2>
         <Button onClick={() => { setShowForm(!showForm); setEditingId(null); setEmpForm({}); }}>
           <Plus className="w-4 h-4" /> {showForm ? 'إغلاق' : 'إضافة موظف'}
         </Button>
      </div>

      {showForm && (
        <GoldCard title={editingId ? "تعديل بيانات موظف" : "بيانات الموظف الجديد"}>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="الاسم" value={empForm.name || ''} onChange={e => setEmpForm({...empForm, name: e.target.value})} required />
            <Input label="الكود الوظيفي" value={empForm.code || ''} onChange={e => setEmpForm({...empForm, code: e.target.value})} required />
            <Input label="المسمى الوظيفي" value={empForm.jobTitle || ''} onChange={e => setEmpForm({...empForm, jobTitle: e.target.value})} required />
            <Input label="رقم الهاتف" value={empForm.phone || ''} onChange={e => setEmpForm({...empForm, phone: e.target.value})} required />
            <Input label="البريد الإلكتروني" value={empForm.email || ''} onChange={e => setEmpForm({...empForm, email: e.target.value})} />
            <div className="col-span-2"><Button type="submit" className="w-full">{editingId ? 'حفظ التعديلات' : 'إضافة الموظف'}</Button></div>
          </form>
        </GoldCard>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map(emp => (
          <div key={emp.id} className="bg-zinc-900 border border-white/10 rounded-xl p-6 relative group hover:border-gold-500/50 transition-all">
            <div className="flex items-start justify-between mb-4">
               <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-gold-500">
                  <UserCircle className="w-8 h-8" />
               </div>
               <div className="flex gap-2">
                 <button onClick={() => handleEdit(emp)} className="text-zinc-600 hover:text-gold-500"><Edit className="w-5 h-5" /></button>
                 <button onClick={() => handleDelete(emp.id)} className="text-zinc-600 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
               </div>
            </div>
            <h3 className="text-lg font-bold text-white">{emp.name}</h3>
            <p className="text-gold-400 text-sm mb-2">{emp.jobTitle}</p>
            <div className="space-y-1 text-sm text-zinc-400">
              <p>كود: {emp.code}</p>
              <p>هاتف: {emp.phone}</p>
              <p>{emp.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 7. Partners Component
const PartnersView = ({ transactions }: { transactions: Transaction[] }) => {
  const [partners, setPartners] = useState<Partner[]>(storage.getPartners());
  const [newPartner, setNewPartner] = useState<Partial<Partner>>({});

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    storage.addPartner({ ...newPartner, percentage: 0, id: Date.now().toString() } as Partner);
    setPartners(storage.getPartners());
    setNewPartner({});
  };

  // Dynamic Calculations
  const totalCapital = useMemo(() => partners.reduce((sum, p) => sum + p.capital, 0), [partners]);
  
  const { netProfit } = useMemo(() => {
    const totalSales = transactions.filter(t => t.type === 'SELL').reduce((sum, t) => sum + t.totalAmount, 0);
    const totalPurchases = transactions.filter(t => t.type === 'BUY').reduce((sum, t) => sum + t.totalAmount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.totalAmount, 0);
    const totalAnalysis = transactions.filter(t => t.type === 'ANALYSIS').reduce((sum, t) => sum + t.totalAmount, 0);
    
    const gross = totalSales - totalPurchases;
    // Include Analysis in Operating Profit
    const operating = gross + totalAnalysis - totalExpenses;
    const tax23 = operating > 0 ? operating * 0.23 : 0;
    const vat14 = operating > 0 ? operating * 0.14 : 0;
    
    return { netProfit: operating - tax23 - vat14 };
  }, [transactions]);

  return (
    <div className="space-y-6">
       {/* Stats Bar */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-zinc-900 p-4 rounded-xl border border-gold-500/20">
            <div className="text-zinc-500 text-sm">إجمالي رأس المال</div>
            <div className="text-2xl font-bold text-gold-400">{totalCapital.toLocaleString()}</div>
          </div>
          <div className="bg-zinc-900 p-4 rounded-xl border border-gold-500/20">
             <div className="text-zinc-500 text-sm">صافي الأرباح (بعد الضرائب)</div>
             <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
               {Math.floor(netProfit).toLocaleString()}
             </div>
          </div>
           <div className="bg-zinc-900 p-4 rounded-xl border border-gold-500/20">
             <div className="text-zinc-500 text-sm">عدد الشركاء</div>
             <div className="text-2xl font-bold text-white">{partners.length}</div>
          </div>
       </div>

       <GoldCard title="إضافة شريك جديد" icon={<Briefcase />}>
         <form onSubmit={handleAdd} className="flex gap-4 items-end">
            <div className="flex-1"><Input label="اسم الشريك" value={newPartner.name || ''} onChange={e => setNewPartner({...newPartner, name: e.target.value})} required /></div>
            <div className="flex-1"><Input label="رأس المال المساهم" type="number" value={newPartner.capital || ''} onChange={e => setNewPartner({...newPartner, capital: parseFloat(e.target.value)})} required /></div>
            <div className="mb-4"><Button type="submit">إضافة</Button></div>
         </form>
       </GoldCard>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {partners.map(p => {
           const sharePercentage = totalCapital > 0 ? (p.capital / totalCapital) * 100 : 0;
           const shareProfit = (netProfit * sharePercentage) / 100;
           
           return (
             <div key={p.id} className="bg-gradient-to-b from-zinc-800 to-zinc-900 p-6 rounded-xl border-t-4 border-gold-500 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-2xl font-bold text-white">{p.name}</h3>
                   <span className="bg-gold-500/20 text-gold-400 px-3 py-1 rounded-full text-sm font-bold">
                     {sharePercentage.toFixed(2)}% حصة
                   </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                   <div className="bg-black/30 p-3 rounded">
                      <div className="text-xs text-zinc-500">رأس المال</div>
                      <div className="text-lg font-bold text-white">{p.capital.toLocaleString()}</div>
                   </div>
                   <div className="bg-black/30 p-3 rounded">
                      <div className="text-xs text-zinc-500">نصيب الربح (الصافي)</div>
                      <div className={`text-lg font-bold ${shareProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {Math.floor(shareProfit).toLocaleString()}
                      </div>
                   </div>
                </div>
                <Button variant="secondary" className="w-full text-sm h-8" onClick={() => {
                    storage.deletePartner(p.id); 
                    setPartners(storage.getPartners());
                }}>حذف الشريك</Button>
             </div>
           );
         })}
       </div>
    </div>
  );
};

// 8. Profit Details View (NEW)
const ProfitDetailsView = ({ transactions, settings }: { transactions: Transaction[], settings: SettingsType }) => {
    const analysis = useMemo(() => {
      const sales = transactions.filter(t => t.type === 'SELL').reduce((sum, t) => sum + t.totalAmount, 0);
      const purchases = transactions.filter(t => t.type === 'BUY').reduce((sum, t) => sum + t.totalAmount, 0);
      const expenses = transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.totalAmount, 0);
      const analysisIncome = transactions.filter(t => t.type === 'ANALYSIS').reduce((sum, t) => sum + t.totalAmount, 0);
      
      const grossProfit = sales - purchases;
      // Adding Analysis income to Operating Profit
      const operatingProfit = grossProfit + analysisIncome - expenses;
      
      // Taxes
      const taxableIncome = operatingProfit > 0 ? operatingProfit : 0;
      const tax23 = taxableIncome * 0.23; // 23% Tax
      const vat14 = taxableIncome * 0.14; // 14% VAT
      
      const netProfit = operatingProfit - tax23 - vat14;
      
      return { sales, purchases, expenses, analysisIncome, grossProfit, operatingProfit, tax23, vat14, netProfit };
    }, [transactions]);
  
    return (
      <div className="space-y-8 animate-in slide-in-from-bottom-4">
          <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-gold-400">تفاصيل الأرباح والضرائب</h2>
              <p className="text-zinc-500 mt-2">تقرير مفصل يشمل عوائد التحليل والاستقطاعات الضريبية</p>
          </div>

          {/* Waterfall Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             <div className="bg-zinc-900 p-6 rounded-xl border border-white/5">
                 <div className="text-zinc-400 text-sm mb-1">إجمالي المبيعات</div>
                 <div className="text-2xl font-bold text-white">{analysis.sales.toLocaleString()}</div>
             </div>
             <div className="bg-zinc-900 p-6 rounded-xl border border-white/5">
                 <div className="text-zinc-400 text-sm mb-1">إجمالي المشتريات</div>
                 <div className="text-2xl font-bold text-white">{analysis.purchases.toLocaleString()}</div>
             </div>
              <div className="bg-blue-900/20 p-6 rounded-xl border border-blue-900/30">
                 <div className="text-blue-400 text-sm mb-1">إيرادات التحليل</div>
                 <div className="text-2xl font-bold text-blue-400">+{analysis.analysisIncome.toLocaleString()}</div>
             </div>
             <div className="bg-red-900/20 p-6 rounded-xl border border-red-900/30">
                 <div className="text-red-400 text-sm mb-1">المصروفات التشغيلية</div>
                 <div className="text-2xl font-bold text-red-400">-{analysis.expenses.toLocaleString()}</div>
             </div>
          </div>

          {/* Taxes Section */}
          <GoldCard title="الاستقطاعات الضريبية" icon={<Landmark />}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="p-4 bg-black/40 rounded-lg">
                      <div className="text-zinc-400 mb-2">الربح التشغيلي (قبل الضرائب)</div>
                      <div className="text-2xl font-bold text-white">{analysis.operatingProfit.toLocaleString()}</div>
                  </div>
                  <div className="p-4 bg-black/40 rounded-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-red-600 text-white text-xs px-2 py-1 rounded-bl">23%</div>
                      <div className="text-zinc-400 mb-2">ضريبة الدخل</div>
                      <div className="text-2xl font-bold text-red-400">-{Math.floor(analysis.tax23).toLocaleString()}</div>
                  </div>
                  <div className="p-4 bg-black/40 rounded-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-orange-600 text-white text-xs px-2 py-1 rounded-bl">14%</div>
                      <div className="text-zinc-400 mb-2">ضريبة القيمة المضافة</div>
                      <div className="text-2xl font-bold text-orange-400">-{Math.floor(analysis.vat14).toLocaleString()}</div>
                  </div>
              </div>
          </GoldCard>

          {/* Final Net */}
          <div className="bg-gradient-to-r from-gold-600 to-gold-400 p-1 rounded-2xl shadow-gold-glow">
              <div className="bg-zinc-900 rounded-xl p-8 text-center">
                  <h3 className="text-xl font-bold text-zinc-400 mb-2">صافي الربح النهائي (Net Profit)</h3>
                  <div className={`text-5xl font-black ${analysis.netProfit >= 0 ? 'text-gold-400' : 'text-red-500'}`}>
                      {Math.floor(analysis.netProfit).toLocaleString()} <span className="text-lg text-white">{settings.currency}</span>
                  </div>
                  <p className="text-zinc-500 mt-4 text-sm">المبلغ المتاح للتوزيع على الشركاء</p>
              </div>
          </div>
      </div>
    );
};

// 9. Permissions Component
const PermissionsView = () => {
  const [permissions, setPermissions] = useState<Permission[]>(storage.getPermissions());
  const [employees] = useState<Employee[]>(storage.getEmployees());
  const [newPerm, setNewPerm] = useState<Partial<Permission>>({ status: 'PENDING', date: new Date().toISOString().split('T')[0] });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(e => e.id === newPerm.employeeId);
    storage.addPermission({
       ...newPerm, 
       id: Date.now().toString(), 
       employeeName: emp?.name || 'Unknown'
    } as Permission);
    setPermissions(storage.getPermissions());
    setNewPerm({ status: 'PENDING', date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
         <GoldCard title="إصدار تصريح نقل" icon={<Truck />}>
            <form onSubmit={handleAdd} className="space-y-4">
               <Select label="الموظف المسؤول" value={newPerm.employeeId || ''} onChange={e => setNewPerm({...newPerm, employeeId: e.target.value})}>
                 <option value="">اختر موظف...</option>
                 {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
               </Select>
               <Input label="الوجهة / خط السير" value={newPerm.destination || ''} onChange={e => setNewPerm({...newPerm, destination: e.target.value})} required />
               <Input label="تفاصيل المنقولات" value={newPerm.items || ''} onChange={e => setNewPerm({...newPerm, items: e.target.value})} required placeholder="مثال: 500 جرام ذهب كسر" />
               <Input label="التاريخ" type="date" value={newPerm.date} onChange={e => setNewPerm({...newPerm, date: e.target.value})} required />
               <Button type="submit" className="w-full">إصدار التصريح</Button>
            </form>
         </GoldCard>
      </div>
      <div className="lg:col-span-2 space-y-4">
         {permissions.map(perm => (
            <div key={perm.id} className="bg-zinc-900 border-r-4 border-gold-500 p-4 rounded shadow flex justify-between items-center">
               <div>
                  <div className="flex items-center gap-2 mb-1">
                     <span className="font-bold text-white">{perm.employeeName}</span>
                     <span className="text-zinc-500 text-sm">| {perm.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gold-400">
                     <MapPin className="w-4 h-4" />
                     {perm.destination}
                  </div>
                  <div className="text-sm text-zinc-400 mt-1">{perm.items}</div>
               </div>
               <div className="text-right">
                  <span className="bg-yellow-900/30 text-yellow-500 px-3 py-1 rounded text-xs font-bold border border-yellow-500/20">
                     جاري التنفيذ
                  </span>
                  <button 
                    onClick={() => {storage.deletePermission(perm.id); setPermissions(storage.getPermissions())}}
                    className="block mt-2 text-xs text-red-500 hover:underline"
                  >
                    إلغاء
                  </button>
               </div>
            </div>
         ))}
         {permissions.length === 0 && <div className="text-center text-zinc-500 mt-10">لا توجد تصاريح نشطة</div>}
      </div>
    </div>
  );
};

// 10. Reports Component
const ReportsView = ({ transactions }: { transactions: Transaction[] }) => {
  const [filterType, setFilterType] = useState('ALL');
  
  const filtered = useMemo(() => {
     if (filterType === 'ALL') return transactions;
     return transactions.filter(t => t.type === filterType);
  }, [transactions, filterType]);

  const totalSum = filtered.reduce((sum, t) => sum + t.totalAmount, 0);

  const handleExport = () => {
    const data = filtered.map(t => ({
      Type: t.type,
      Date: t.date,
      Party: t.customerName || t.description || '-',
      Weight: t.weight || 0,
      Karat: t.karat || 0,
      Total: t.totalAmount
    }));
    exportToCSV(data, `PyramidsGold_Report_${filterType}_${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center bg-zinc-900 p-4 rounded-xl border border-white/10 no-print">
          <div className="flex gap-2">
             {['ALL', 'BUY', 'SELL', 'ANALYSIS', 'EXPENSE'].map(type => (
               <button
                 key={type}
                 onClick={() => setFilterType(type)}
                 className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filterType === type ? 'bg-gold-500 text-black' : 'bg-black/40 text-zinc-400 hover:text-white'}`}
               >
                 {type === 'ALL' ? 'الكل' : type === 'BUY' ? 'شراء' : type === 'SELL' ? 'بيع' : type === 'EXPENSE' ? 'مصاريف' : 'تحليل'}
               </button>
             ))}
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExport} variant="secondary"><FileSpreadsheet className="w-4 h-4" /> تصدير Excel</Button>
            <Button onClick={() => window.print()} variant="primary"><Printer className="w-4 h-4" /> طباعة التقرير</Button>
          </div>
       </div>

       {/* Styled Report Sheet (Dark on Screen, White on Print) */}
       <div className="bg-[#1e1e1e] print:bg-white text-white print:text-black p-8 rounded-xl shadow-2xl border border-white/10 print:border-none print:shadow-none">
          <div className="text-center border-b-2 border-gold-500 print:border-black pb-6 mb-6">
             <h1 className="text-3xl font-bold mb-2 text-gold-400 print:text-black">بيراميدز جولد - تقرير العمليات</h1>
             <p className="text-zinc-400 print:text-gray-600">تاريخ الإصدار: {new Date().toLocaleDateString('ar-EG')}</p>
          </div>

          <table className="w-full text-right border-collapse">
             <thead>
                <tr className="bg-black/30 print:bg-gray-100 border-b border-white/10 print:border-black text-gold-400 print:text-black">
                   <th className="p-3 font-bold">نوع العملية</th>
                   <th className="p-3 font-bold">التاريخ</th>
                   <th className="p-3 font-bold">الطرف الآخر</th>
                   <th className="p-3 font-bold">الوزن</th>
                   <th className="p-3 font-bold">العيار</th>
                   <th className="p-3 font-bold">الإجمالي</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-white/5 print:divide-gray-300">
                {filtered.map(t => (
                   <tr key={t.id} className="hover:bg-white/5 print:hover:bg-transparent">
                      <td className="p-3 font-bold print:text-black">
                        <span className={`print:hidden px-2 py-1 rounded text-xs ${t.type === 'BUY' ? 'bg-blue-900/50 text-blue-200' : t.type === 'SELL' ? 'bg-green-900/50 text-green-200' : 'bg-zinc-800 text-zinc-300'}`}>
                           {t.type === 'BUY' ? 'شراء' : t.type === 'SELL' ? 'بيع' : t.type === 'EXPENSE' ? 'مصروف' : 'تحليل'}
                        </span>
                        <span className="hidden print:inline">{t.type === 'BUY' ? 'شراء' : t.type === 'SELL' ? 'بيع' : t.type === 'EXPENSE' ? 'مصروف' : 'تحليل'}</span>
                      </td>
                      <td className="p-3 print:text-black">{t.date}</td>
                      <td className="p-3 print:text-black">{t.customerName || t.description || '-'}</td>
                      <td className="p-3 print:text-black">{t.weight ? `${t.weight}g` : '-'}</td>
                      <td className="p-3 print:text-black">{t.karat || '-'}</td>
                      <td className="p-3 font-bold text-gold-400 print:text-black">{t.totalAmount.toLocaleString()}</td>
                   </tr>
                ))}
             </tbody>
             <tfoot>
                <tr className="bg-gold-900/20 print:bg-gray-100 font-bold text-lg border-t-2 border-gold-500 print:border-black mt-4">
                   <td colSpan={5} className="p-4 text-left text-gold-200 print:text-black">الإجمالي الكلي:</td>
                   <td className="p-4 text-gold-400 print:text-black">{totalSum.toLocaleString()} EGP</td>
                </tr>
             </tfoot>
          </table>

          <div className="mt-12 flex justify-between px-10 print:flex">
             <div className="text-center">
                <p className="font-bold mb-8 text-zinc-400 print:text-black">المحاسب</p>
                <div className="w-32 border-b border-white/20 print:border-black"></div>
             </div>
             <div className="text-center">
                <p className="font-bold mb-8 text-zinc-400 print:text-black">المدير العام</p>
                <div className="w-32 border-b border-white/20 print:border-black"></div>
             </div>
          </div>
       </div>
    </div>
  );
}

// 11. CCTV / Monitor Component (NEW)
const CCTVView = () => {
   const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
   const [selectedDeviceId, setSelectedDeviceId] = useState('');
   const [isStreaming, setIsStreaming] = useState(false);
   const videoRef = useRef<HTMLVideoElement>(null);
   const streamRef = useRef<MediaStream | null>(null);

   useEffect(() => {
      // Request permission and enumerate devices
      const getDevices = async () => {
         try {
            await navigator.mediaDevices.getUserMedia({ video: true }); // Prompt permission
            const allDevices = await navigator.mediaDevices.enumerateDevices();
            const videoInputs = allDevices.filter(d => d.kind === 'videoinput');
            setDevices(videoInputs);
            if(videoInputs.length > 0) setSelectedDeviceId(videoInputs[0].deviceId);
         } catch (err) {
            console.error("Error accessing devices:", err);
            alert('يرجى السماح بصلاحيات الكاميرا للوصول إلى أجهزة العرض');
         }
      };
      getDevices();
   }, []);

   const toggleStream = async () => {
      if (isStreaming) {
         // Stop
         if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
         }
         if (videoRef.current) videoRef.current.srcObject = null;
         setIsStreaming(false);
      } else {
         // Start
         try {
            const stream = await navigator.mediaDevices.getUserMedia({
               video: { deviceId: { exact: selectedDeviceId }, width: { ideal: 1920 }, height: { ideal: 1080 } }
            });
            streamRef.current = stream;
            if (videoRef.current) {
               videoRef.current.srcObject = stream;
            }
            setIsStreaming(true);
         } catch (err) {
            console.error("Stream Error:", err);
            alert('تعذر الاتصال بجهاز العرض المختار. تأكد من توصيل كابل HDMI عبر Capture Card.');
         }
      }
   };

   // Cleanup
   useEffect(() => {
      return () => {
         if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
         }
      };
   }, []);

   return (
      <GoldCard title="شاشة المراقبة (HDMI Input / CCTV)" icon={<Monitor />}>
         <div className="space-y-6">
            <div className="bg-zinc-900 p-4 rounded-lg border border-yellow-500/20 flex items-center gap-3 text-sm text-yellow-200/80">
               <Info className="w-5 h-5 flex-shrink-0" />
               <p>
                  لعرض محتوى الكاميرات أو HDMI: يرجى توصيل جهاز الـ DVR/NVR بالكمبيوتر باستخدام قطعة 
                  <span className="text-white font-bold mx-1">HDMI Video Capture Card (USB)</span> 
                  واختيارها من القائمة أدناه.
               </p>
            </div>

            <div className="flex gap-4 items-end">
               <div className="flex-1">
                  <Select 
                     label="اختر جهاز الإدخال (Source)" 
                     value={selectedDeviceId} 
                     onChange={e => setSelectedDeviceId(e.target.value)}
                  >
                     {devices.map((d, idx) => (
                        <option key={d.deviceId} value={d.deviceId}>
                           {d.label || `Device ${idx + 1}`}
                        </option>
                     ))}
                  </Select>
               </div>
               <div className="mb-4">
                  <Button 
                     onClick={toggleStream} 
                     variant={isStreaming ? 'danger' : 'primary'}
                     className="min-w-[150px]"
                  >
                     {isStreaming ? <><Square className="w-4 h-4 fill-current" /> إيقاف العرض</> : <><Play className="w-4 h-4 fill-current" /> بدء العرض</>}
                  </Button>
               </div>
            </div>

            {/* Video Container */}
            <div className="relative bg-black rounded-xl overflow-hidden aspect-video border-4 border-zinc-800 shadow-2xl">
               {!isStreaming && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600">
                     <Monitor className="w-16 h-16 mb-4 opacity-20" />
                     <p>لا يوجد إشارة فيديو</p>
                  </div>
               )}
               <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className={`w-full h-full object-contain bg-black ${!isStreaming ? 'hidden' : ''}`}
               />
               {isStreaming && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-red-600 text-white text-xs font-bold rounded animate-pulse">
                     LIVE
                  </div>
               )}
            </div>
         </div>
      </GoldCard>
   );
};

// 12. Settings & Admin Panel
const SettingsPanel = ({ settings, onUpdate }: { settings: SettingsType, onUpdate: (s: SettingsType) => void }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [activeTab, setActiveTab] = useState<'general' | 'users' | 'system'>('general');
  const [users, setUsers] = useState<User[]>(storage.getUsers());
  
  // User Edit State
  const [userForm, setUserForm] = useState<Partial<User>>({ role: UserRole.LIMITED });
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  
  const handleSaveSettings = () => {
    onUpdate(localSettings);
    alert('تم حفظ الإعدادات العامة بنجاح!');
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if(!userForm.username || !userForm.password) return;
    
    if (editingUserId) {
      // Update existing
      storage.updateUser({ ...userForm, id: editingUserId } as User);
      alert('تم تعديل بيانات المستخدم');
    } else {
      // Create new
      storage.addUser({ ...userForm, id: Date.now().toString(), lastLogin: '' } as User);
      alert('تم إضافة المستخدم');
    }
    
    setUsers(storage.getUsers());
    setUserForm({ role: UserRole.LIMITED, username: '', password: '' });
    setEditingUserId(null);
  };

  const handleEditUser = (u: User) => {
    setEditingUserId(u.id);
    setUserForm(u);
  };

  const handleDeleteUser = (id: string) => {
    if(confirm('هل تريد حذف هذا المستخدم؟')) {
      storage.deleteUser(id);
      setUsers(storage.getUsers());
    }
  };

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      storage.restoreBackup(file, (success) => {
        if(success) alert('تم استعادة النسخة الاحتياطية بنجاح! يرجى إعادة تحميل الصفحة.');
        else alert('فشل في استعادة الملف. تأكد من صحة الملف.');
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Settings Tabs */}
      <div className="flex space-x-4 space-x-reverse border-b border-white/10 pb-1">
         <button onClick={() => setActiveTab('general')} className={`px-6 py-3 font-bold rounded-t-lg transition-colors ${activeTab === 'general' ? 'bg-gold-500 text-black' : 'text-zinc-400 hover:text-white'}`}>
            <SettingsIcon className="inline w-4 h-4 ml-2" /> عام
         </button>
         <button onClick={() => setActiveTab('users')} className={`px-6 py-3 font-bold rounded-t-lg transition-colors ${activeTab === 'users' ? 'bg-gold-500 text-black' : 'text-zinc-400 hover:text-white'}`}>
            <Users className="inline w-4 h-4 ml-2" /> المستخدمين والصلاحيات
         </button>
         <button onClick={() => setActiveTab('system')} className={`px-6 py-3 font-bold rounded-t-lg transition-colors ${activeTab === 'system' ? 'bg-gold-500 text-black' : 'text-zinc-400 hover:text-white'}`}>
            <Database className="inline w-4 h-4 ml-2" /> النظام والبيانات
         </button>
      </div>

      {/* GENERAL TAB */}
      {activeTab === 'general' && (
        <div className="animate-in fade-in slide-in-from-bottom-4">
          <GoldCard title="أسعار الذهب (السوق)" icon={<TrendingUp />}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Input label="سعر عيار 24" type="number" value={localSettings.goldPrice24} onChange={e => setLocalSettings({...localSettings, goldPrice24: parseFloat(e.target.value)})} />
              <Input label="سعر عيار 21" type="number" value={localSettings.goldPrice21} onChange={e => setLocalSettings({...localSettings, goldPrice21: parseFloat(e.target.value)})} />
              <Input label="سعر عيار 18" type="number" value={localSettings.goldPrice18} onChange={e => setLocalSettings({...localSettings, goldPrice18: parseFloat(e.target.value)})} />
            </div>
          </GoldCard>
          <GoldCard title="إعدادات النظام" className="mt-6" icon={<SettingsIcon />}>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Input label="العملة" value={localSettings.currency} onChange={e => setLocalSettings({...localSettings, currency: e.target.value})} />
               <Input label="نسبة الضريبة %" type="number" value={localSettings.taxRate} onChange={e => setLocalSettings({...localSettings, taxRate: parseFloat(e.target.value)})} />
             </div>
             <Button onClick={handleSaveSettings} className="mt-6 w-full">حفظ التغييرات</Button>
          </GoldCard>
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6">
          <GoldCard title={editingUserId ? "تعديل صلاحيات المستخدم" : "إضافة مستخدم جديد"} icon={<Plus />}>
             <form onSubmit={handleSaveUser} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <Input label="اسم المستخدم" value={userForm.username || ''} onChange={e => setUserForm({...userForm, username: e.target.value})} required />
                <Input label="كلمة المرور" value={userForm.password || ''} onChange={e => setUserForm({...userForm, password: e.target.value})} required />
                <Select label="الصلاحية (القسم)" value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value as UserRole})}>
                   <option value={UserRole.ADMIN}>مدير كامل (كل الأقسام)</option>
                   <option value={UserRole.LIMITED}>مستخدم محدود (بيع وشراء فقط)</option>
                </Select>
                <div className="flex gap-2 mb-4">
                   <Button type="submit" className="flex-1">{editingUserId ? 'حفظ' : 'إضافة'}</Button>
                   {editingUserId && <Button type="button" variant="secondary" onClick={() => {setEditingUserId(null); setUserForm({ role: UserRole.LIMITED, username: '', password: '' });}}>إلغاء</Button>}
                </div>
             </form>
          </GoldCard>
          <div className="bg-zinc-900 rounded-xl overflow-hidden border border-white/10">
             <table className="w-full text-right">
                <thead className="bg-black/50 text-gold-500">
                   <tr>
                      <th className="p-4">المستخدم</th>
                      <th className="p-4">الصلاحية</th>
                      <th className="p-4">آخر دخول</th>
                      <th className="p-4">تحكم</th>
                   </tr>
                </thead>
                <tbody>
                   {users.map(u => (
                      <tr key={u.id} className="border-t border-white/5 hover:bg-white/5">
                         <td className="p-4 font-bold">{u.username}</td>
                         <td className="p-4">
                           <span className={`px-2 py-1 rounded text-xs ${u.role === UserRole.ADMIN ? 'bg-red-900 text-red-200' : 'bg-blue-900 text-blue-200'}`}>
                             {u.role === UserRole.ADMIN ? 'Admin (مدير)' : 'Limited (محدود)'}
                           </span>
                         </td>
                         <td className="p-4 text-zinc-500 text-sm">{u.lastLogin || 'لم يدخل بعد'}</td>
                         <td className="p-4 flex gap-2">
                            <button onClick={() => handleEditUser(u)} className="text-gold-500 hover:text-gold-400"><Edit className="w-4 h-4" /></button>
                            {u.username !== 'aadd' && (
                               <button onClick={() => handleDeleteUser(u.id)} className="text-red-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                            )}
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>
      )}

      {/* SYSTEM TAB */}
      {activeTab === 'system' && (
         <div className="animate-in fade-in slide-in-from-bottom-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <GoldCard title="النسخ الاحتياطي" icon={<Save />}>
               <p className="text-zinc-400 mb-4 text-sm">قم بتنزيل نسخة كاملة من قاعدة البيانات (JSON) للاحتفاظ بها بأمان.</p>
               <Button onClick={storage.createBackup} className="w-full">
                 تحميل نسخة احتياطية
               </Button>
            </GoldCard>

            <GoldCard title="استعادة البيانات" icon={<Upload />}>
               <p className="text-zinc-400 mb-4 text-sm">استرجع البيانات من ملف نسخ احتياطي سابق.</p>
               <div className="relative">
                  <input type="file" accept=".json" onChange={handleRestore} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <Button variant="secondary" className="w-full pointer-events-none">
                     <Upload className="w-4 h-4 ml-2" />
                     اختر ملف لاستعادته
                  </Button>
               </div>
            </GoldCard>

            <GoldCard title="إعادة ضبط المصنع" icon={<RotateCcw />} className="md:col-span-2 border-red-900/50">
               <div className="flex justify-between items-center">
                  <div>
                     <h4 className="text-red-500 font-bold">مسح جميع البيانات</h4>
                     <p className="text-zinc-500 text-sm">سيتم حذف جميع العمليات والموظفين والشركاء. لا يمكن التراجع عن هذا الإجراء.</p>
                  </div>
                  <Button variant="danger" onClick={() => {
                     if(confirm('تحذير: سيتم مسح جميع البيانات! هل أنت متأكد؟')) {
                        storage.clearTransactions();
                        alert('تم مسح البيانات. يرجى تحديث الصفحة.');
                        window.location.reload();
                     }
                  }}>
                     حذف البيانات
                  </Button>
               </div>
            </GoldCard>
         </div>
      )}
    </div>
  );
};

// --- MAIN LAYOUT ---

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [settings, setSettings] = useState<SettingsType>(storage.getSettings());
  
  // Live Data States
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [liveGoldPrice, setLiveGoldPrice] = useState(settings.goldPrice24); // Initialize with manual
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    setTransactions(storage.getTransactions());
    
    // Mock Live Price Fetching (Since we don't have a paid API key for GoldAPI)
    // In a real app, this would use fetch('https://www.goldapi.io/api/XAU/USD', ...)
    const interval = setInterval(() => {
       if(navigator.onLine) {
          // Simulating small market fluctuations around the manual price to denote "Live" activity
          const fluctuation = (Math.random() - 0.5) * 20; 
          setLiveGoldPrice(prev => Number((settings.goldPrice24 + fluctuation).toFixed(2)));
       }
    }, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [settings.goldPrice24, view]); // Refresh on view change

  const handleLogout = () => setUser(null);

  const handleSaveTransaction = (t: Transaction) => {
    storage.addTransaction(t);
    setTransactions(storage.getTransactions());
  };

  const handleUpdateSettings = (s: SettingsType) => {
    storage.saveSettings(s);
    setSettings(s);
    setLiveGoldPrice(s.goldPrice24); // Reset live to base when manual changes
  };

  // Market Advice Logic
  const marketAdvice = useMemo(() => {
     if (liveGoldPrice > settings.goldPrice24 + 50) return { type: 'sell', text: 'السعر العالمي مرتفع - فرصة للبيع', color: 'text-green-400' };
     if (liveGoldPrice < settings.goldPrice24 - 50) return { type: 'buy', text: 'السعر العالمي منخفض - فرصة للشراء', color: 'text-blue-400' };
     return { type: 'stable', text: 'السوق مستقر - تداول طبيعي', color: 'text-zinc-400' };
  }, [liveGoldPrice, settings.goldPrice24]);

  if (!user) {
    return <LoginScreen onLogin={setUser} />;
  }

  const menuItems = [
    { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard, role: 'all' },
    { id: 'cctv', label: 'كاميرات المراقبة', icon: Monitor, role: 'all' }, // New Item
    { id: 'analysis', label: 'التحليل والفحص', icon: Beaker, role: 'all' },
    { id: 'buy', label: 'شراء ذهب', icon: ShoppingCart, role: 'all' },
    { id: 'sell', label: 'بيع ذهب', icon: BadgePercent, role: 'all' },
    { id: 'pricing', label: 'تحيف الذهب', icon: Calculator, role: 'all' },
    { id: 'profit-details', label: 'تفاصيل الأرباح', icon: PieChart, role: UserRole.ADMIN },
    { id: 'expenses', label: 'المصاريف', icon: Banknote, role: UserRole.ADMIN },
    { id: 'employees', label: 'الموظفين', icon: Users, role: UserRole.ADMIN },
    { id: 'partners', label: 'الشركاء', icon: UserCircle, role: UserRole.ADMIN },
    { id: 'permissions', label: 'التصاريح', icon: Truck, role: UserRole.ADMIN },
    { id: 'reports', label: 'التقارير', icon: FileText, role: UserRole.ADMIN },
    { id: 'settings', label: 'الإعدادات', icon: SettingsIcon, role: UserRole.ADMIN },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-dark-bg text-white font-sans selection:bg-gold-500 selection:text-black">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 border-l border-white/10 flex flex-col shadow-2xl z-20 relative no-print">
        <div className="p-6 flex items-center justify-center border-b border-white/10 bg-gradient-to-b from-zinc-800 to-zinc-900">
           {/* Small Logo in Sidebar */}
           <div className="mr-3">
              <AnimatedLogo size="small" />
           </div>
           <div>
             <h1 className="font-bold text-lg tracking-wider text-gold-100">PYRAMIDS</h1>
             <span className="text-xs text-gold-500 tracking-[0.2em]">GOLD</span>
           </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 space-y-1">
          {menuItems.filter(item => item.role === 'all' || item.role === user.role).map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center px-6 py-3 transition-all duration-200 border-r-4 ${
                view === item.id 
                  ? 'bg-white/5 border-gold-500 text-gold-400 shadow-inner-glow' 
                  : 'border-transparent text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className={`w-5 h-5 ml-3 ${view === item.id ? 'text-gold-500' : ''}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 bg-zinc-900">
          <div className="flex items-center mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center ml-2">
              <UserCircle className="w-5 h-5 text-zinc-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{user.username}</div>
              <div className="text-xs text-zinc-500">{user.role === UserRole.ADMIN ? 'مدير النظام' : 'مستخدم محدود'}</div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2 rounded bg-red-900/20 text-red-400 hover:bg-red-900/40 transition-colors border border-red-900/30"
          >
            <LogOut className="w-4 h-4 ml-2" />
            تسجيل خروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Top Ticker Bar */}
        <header className="h-16 bg-zinc-900 border-b border-white/10 flex items-center justify-between px-6 shadow-md z-10 no-print">
          <div className="flex items-center gap-4">
             <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${isOnline ? 'bg-green-900/30 text-green-400 border-green-900' : 'bg-red-900/30 text-red-400 border-red-900'}`}>
                {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                {isOnline ? 'متصل بالإنترنت' : 'وضع غير متصل'}
             </div>
             <div className="hidden md:flex items-center text-sm">
                <span className="text-zinc-400 ml-2">{new Date().toLocaleDateString('ar-EG')}</span>
             </div>
          </div>
          
          {/* Market Advice Widget */}
          <div className="hidden lg:flex items-center bg-black/40 px-4 py-2 rounded-lg border border-white/5 gap-3">
             <Info className={`w-4 h-4 ${marketAdvice.color}`} />
             <span className={`text-sm font-bold ${marketAdvice.color}`}>{marketAdvice.text}</span>
          </div>

          {/* Live Price Ticker */}
          <div className="flex items-center gap-6">
             <div className="text-right">
               <div className="text-[10px] text-zinc-500 uppercase tracking-wider flex items-center gap-1 justify-end">
                  <Globe className="w-3 h-3" /> سعر السوق (Live)
               </div>
               <div className="text-xl font-black text-white font-mono leading-none">
                 {liveGoldPrice.toLocaleString()}
               </div>
             </div>
             <div className="w-px h-8 bg-white/10"></div>
             <div className="text-right">
               <div className="text-[10px] text-gold-500 uppercase tracking-wider">مثبت يدوياً (Manual)</div>
               <div className="text-xl font-black text-gold-400 font-mono leading-none">
                 {settings.goldPrice24.toLocaleString()}
               </div>
             </div>
          </div>
        </header>

        {/* View Area */}
        <div className="flex-1 overflow-auto p-8 scroll-smooth bg-dark-bg relative print:bg-white print:text-black print:p-0">
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/4 no-print"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto print:max-w-full">
            {view === 'dashboard' && <Dashboard transactions={transactions} settings={settings} />}
            {view === 'cctv' && <CCTVView />}
            {view === 'analysis' && <OperationForm type="ANALYSIS" settings={settings} onSave={handleSaveTransaction} />}
            {view === 'buy' && <OperationForm type="BUY" settings={settings} onSave={handleSaveTransaction} />}
            {view === 'sell' && <OperationForm type="SELL" settings={settings} onSave={handleSaveTransaction} />}
            {view === 'pricing' && <PricingCalculator settings={settings} />}
            {view === 'profit-details' && <ProfitDetailsView transactions={transactions} settings={settings} />}
            {view === 'settings' && <SettingsPanel settings={settings} onUpdate={handleUpdateSettings} />}
            
            {view === 'expenses' && <ExpensesView settings={settings} onSave={handleSaveTransaction} />}
            {view === 'employees' && <EmployeesView />}
            {view === 'partners' && <PartnersView transactions={transactions} />}
            {view === 'permissions' && <PermissionsView />}
            {view === 'reports' && <ReportsView transactions={transactions} />}

            {/* Recent Transactions List for Operation Pages */}
            {(view === 'buy' || view === 'sell' || view === 'analysis') && (
              <div className="mt-8 animate-in slide-in-from-bottom-4 duration-500 no-print">
                <h3 className="text-xl font-bold text-white mb-4 border-r-4 border-gold-500 pr-3">آخر العمليات</h3>
                <div className="bg-zinc-900 rounded-xl border border-white/10 overflow-hidden">
                  <table className="w-full text-right">
                    <thead className="bg-zinc-800 text-zinc-400 text-sm uppercase">
                      <tr>
                        <th className="px-6 py-3">المعرف</th>
                        <th className="px-6 py-3">العميل</th>
                        <th className="px-6 py-3">النوع</th>
                        <th className="px-6 py-3">المبلغ</th>
                        <th className="px-6 py-3">التاريخ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {transactions.filter(t => t.type.toUpperCase() === view.toUpperCase()).slice(0, 5).map(t => (
                        <tr key={t.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 font-mono text-zinc-500 text-sm">#{t.id.slice(-4)}</td>
                          <td className="px-6 py-4 font-bold">{t.customerName}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${t.type === 'BUY' ? 'bg-blue-900 text-blue-300' : t.type === 'SELL' ? 'bg-green-900 text-green-300' : 'bg-purple-900 text-purple-300'}`}>
                              {t.type === 'BUY' ? 'شراء' : t.type === 'SELL' ? 'بيع' : 'فحص'}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-mono text-gold-400">{t.totalAmount.toLocaleString()}</td>
                          <td className="px-6 py-4 text-zinc-500">{t.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;

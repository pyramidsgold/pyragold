
import { Transaction, Employee, Partner, Settings, Permission, User, UserRole } from '../types';

// Keys
const KEY_TRANSACTIONS = 'pg_transactions';
const KEY_EMPLOYEES = 'pg_employees';
const KEY_PARTNERS = 'pg_partners';
const KEY_SETTINGS = 'pg_settings';
const KEY_PERMISSIONS = 'pg_permissions';
const KEY_USERS = 'pg_users';

// Initial Data
const initialSettings: Settings = {
  goldPrice24: 3100,
  goldPrice21: 2700,
  goldPrice18: 2300,
  taxRate: 0,
  currency: 'EGP'
};

const initialEmployees: Employee[] = [
  { id: '1', name: 'أحمد محمد', code: 'EMP001', jobTitle: 'فني فحص', phone: '0100000001', email: 'ahmed@pg.com' },
  { id: '2', name: 'سارة علي', code: 'EMP002', jobTitle: 'محاسب', phone: '0100000002', email: 'sara@pg.com' }
];

const initialPartners: Partner[] = [
  { id: '1', name: 'محمود المصري', capital: 5000000, percentage: 40 },
  { id: '2', name: 'خالد يوسف', capital: 3000000, percentage: 25 }
];

const initialUsers: User[] = [
  { id: '1', username: 'aadd', password: '2026', role: UserRole.ADMIN, lastLogin: '' },
  { id: '2', username: 'aa20', password: '2020', role: UserRole.LIMITED, lastLogin: '' }
];

export const storage = {
  // Settings
  getSettings: (): Settings => {
    const data = localStorage.getItem(KEY_SETTINGS);
    return data ? JSON.parse(data) : initialSettings;
  },
  saveSettings: (settings: Settings) => {
    localStorage.setItem(KEY_SETTINGS, JSON.stringify(settings));
  },
  
  // Users
  getUsers: (): User[] => {
    const data = localStorage.getItem(KEY_USERS);
    return data ? JSON.parse(data) : initialUsers;
  },
  saveUsers: (users: User[]) => {
    localStorage.setItem(KEY_USERS, JSON.stringify(users));
  },
  addUser: (user: User) => {
    const current = storage.getUsers();
    storage.saveUsers([...current, user]);
  },
  updateUser: (updatedUser: User) => {
    const current = storage.getUsers();
    const index = current.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      current[index] = updatedUser;
      storage.saveUsers(current);
    }
  },
  deleteUser: (id: string) => {
    const current = storage.getUsers();
    storage.saveUsers(current.filter(u => u.id !== id));
  },
  
  // Transactions (Sales, Buy, Analysis, Expenses)
  getTransactions: (): Transaction[] => {
    const data = localStorage.getItem(KEY_TRANSACTIONS);
    return data ? JSON.parse(data) : [];
  },
  addTransaction: (tx: Transaction) => {
    const current = storage.getTransactions();
    localStorage.setItem(KEY_TRANSACTIONS, JSON.stringify([tx, ...current]));
  },
  clearTransactions: () => {
    localStorage.removeItem(KEY_TRANSACTIONS);
  },

  // Employees
  getEmployees: (): Employee[] => {
    const data = localStorage.getItem(KEY_EMPLOYEES);
    return data ? JSON.parse(data) : initialEmployees;
  },
  saveEmployees: (emps: Employee[]) => {
    localStorage.setItem(KEY_EMPLOYEES, JSON.stringify(emps));
  },
  addEmployee: (emp: Employee) => {
    const current = storage.getEmployees();
    storage.saveEmployees([...current, emp]);
  },
  updateEmployee: (updatedEmp: Employee) => {
    const current = storage.getEmployees();
    const index = current.findIndex(e => e.id === updatedEmp.id);
    if (index !== -1) {
      current[index] = updatedEmp;
      storage.saveEmployees(current);
    }
  },
  deleteEmployee: (id: string) => {
    const current = storage.getEmployees();
    storage.saveEmployees(current.filter(e => e.id !== id));
  },

  // Partners
  getPartners: (): Partner[] => {
    const data = localStorage.getItem(KEY_PARTNERS);
    return data ? JSON.parse(data) : initialPartners;
  },
  savePartners: (partners: Partner[]) => {
    localStorage.setItem(KEY_PARTNERS, JSON.stringify(partners));
  },
  addPartner: (p: Partner) => {
    const current = storage.getPartners();
    storage.savePartners([...current, p]);
  },
  deletePartner: (id: string) => {
    const current = storage.getPartners();
    storage.savePartners(current.filter(p => p.id !== id));
  },

  // Permissions (Transport Orders)
  getPermissions: (): Permission[] => {
    const data = localStorage.getItem(KEY_PERMISSIONS);
    return data ? JSON.parse(data) : [];
  },
  addPermission: (p: Permission) => {
    const current = storage.getPermissions();
    localStorage.setItem(KEY_PERMISSIONS, JSON.stringify([p, ...current]));
  },
  deletePermission: (id: string) => {
    const current = storage.getPermissions();
    localStorage.setItem(KEY_PERMISSIONS, JSON.stringify(current.filter(p => p.id !== id)));
  },
  
  // Mock Backup
  createBackup: () => {
    const backup = {
      settings: storage.getSettings(),
      users: storage.getUsers(),
      transactions: storage.getTransactions(),
      employees: storage.getEmployees(),
      partners: storage.getPartners(),
      permissions: storage.getPermissions(),
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(backup)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PyramidsGold_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  },
  
  restoreBackup: (file: File, callback: (success: boolean) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.settings) localStorage.setItem(KEY_SETTINGS, JSON.stringify(data.settings));
        if (data.users) localStorage.setItem(KEY_USERS, JSON.stringify(data.users));
        if (data.transactions) localStorage.setItem(KEY_TRANSACTIONS, JSON.stringify(data.transactions));
        if (data.employees) localStorage.setItem(KEY_EMPLOYEES, JSON.stringify(data.employees));
        if (data.partners) localStorage.setItem(KEY_PARTNERS, JSON.stringify(data.partners));
        if (data.permissions) localStorage.setItem(KEY_PERMISSIONS, JSON.stringify(data.permissions));
        callback(true);
      } catch (err) {
        console.error(err);
        callback(false);
      }
    };
    reader.readAsText(file);
  }
};

import 'dotenv/config';
import express from 'express';
import cors from 'cors'; // 原本不行所以要導入type/cors
import { createClient } from '@supabase/supabase-js';
import type { Request, Response } from 'express'; // 因為我寫req,res
import jwt from 'jsonwebtoken';

interface User {
  id: string
  user_id: string,
  username: string,
  bg_url: string,
  created_at: string
}

// 定義型別
interface Todo {
  id: string;
  title: string;
  completed: boolean;
  user_id: string;
  created_at: string;
}

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const getUserFromToken = (req: Request) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  const token = authHeader.replace('Bearer ', '');

  // 改用本地驗證 不需經過supabase
  // const {
  //   data: { user },
  //   error,
  // } = await supabase.auth.getUser(token);

  try {
    // JWT Secret 驗證並解析 token
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET!);
    //  jwt.verify() 做的事：
    // 1. 用 JWT Secret 驗證 Signature 是否正確（確保沒被竄改）
    // 2. 檢查是否過期
    // 3. 回傳 Payload 內容（包含 user_id）
    // decoded.sub 就是 user_id
    return { id: decoded.sub };
  } catch {
    return null;
  }
};

app.get('/', (req: Request, res: Response) => {
  res.send('測試後端用的');
});

app.get('/todos', async (req: Request, res: Response) => {
  console.log('1. 收到請求', Date.now());
  const user = getUserFromToken(req);
  if (!user) return res.status(401).json({ message: '未登入' });
  try {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', user.id)
      .eq('due_date', req.query.date)
      .order('created_at', { ascending: false });
    console.log('2. Supabase 回傳', Date.now());
    if (error) throw error;

    res.json(data);
  } catch (error) {
    return res.status(500).json({ message: '呼叫 Todo 失敗' });
  }
});

app.post('/todos', async (req: Request, res: Response) => {
  const user = getUserFromToken(req);
  if (!user) return res.status(401).json({ message: '未登入' });
  try {
    const { title, due_date } = req.body;

    if (!title) {
      return res.status(400).json({ message: '請輸入標題' });
    }

    const { data, error } = await supabase
      .from('todos')
      .insert([{ title, user_id: user.id, due_date }])
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: '新增 Todo 失敗' });
  }
});

app.get('/profile', async (req: Request, res: Response) => {
  const user = getUserFromToken(req);
  if (!user) return res.status(401).json({ message: '未登入' });
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: '無法讀取個人資訊' });
  }
});

app.post('/profile', async (req: Request, res: Response) => {
  const user = getUserFromToken(req);
  if (!user) return res.status(401).json({ message: '未登入' });
  try {
    const updateData: Record<string, any> = { user_id: user.id };
    // 直接用 req.body
    if (req.body.username !== undefined) updateData.username = req.body.username;
    if (req.body.bg_url !== undefined) updateData.bg_url = req.body.bg_url;
    // const allowedFields = ['username', 'bg_url'];
    //  for (const field of allowedFields) {
    //     if (req.body[field] !== undefined) {
    //       updateData[field] = req.body[field];
    //     }
    //   }
    console.log('updateData:', updateData);
    const { data, error } = await supabase
      .from('profiles')
      .upsert(updateData, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Profile 錯誤:', error);
    res.status(500).json({ message: '無法更新個人資訊' });
  }
});

app.put('/profile', async (req: Request, res: Response) => {
  const user = getUserFromToken(req);
  if (!user) return res.status(401).json({ message: '未登入' });
  try {
    const { username, bg_url } = req.body;
    if (username === undefined && bg_url === undefined) {
      return res.status(400).json({
        message: '沒有新的資源被更新',
      });
    }
    const updateData: Partial<User> = {};
    if (username !== undefined) updateData.username = username;
    if (bg_url !== undefined) updateData.bg_url = bg_url;
    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Profile 錯誤:', error);
    res.status(500).json({ message: '無法更新個人資訊' });
  }
});

app.put('/todo/:id', async (req: Request, res: Response) => {
  const user = getUserFromToken(req);
  if (!user) return res.status(401).json({ message: '未登入' });
  try {
    const { id } = req.params;
    const { title, completed } = req.body;
    if (title === undefined && completed === undefined) {
      return res.status(400).json({
        message: '沒有新的資源被更新',
      });
    }
    // 在更新一筆紀錄的時候，假如有三個欄位，而你只想更新一個欄位，那麼你就可以使用 Partial 作為 req 的標示
    const updateData: Partial<Todo> = {};
    if (title !== undefined) updateData.title = title;
    if (completed !== undefined) updateData.completed = completed;

    const { data, error } = await supabase
      .from('todos')
      .update(updateData)
      .eq('user_id', user.id)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: '更新 Todo 失敗' });
  }
});

app.delete('/todos/:id', async (req: Request, res: Response) => {
  const user = getUserFromToken(req);
  if (!user) return res.status(401).json({ message: '未登入' });
  try {
    const { id } = req.params;
    const { error } = await supabase.from('todos').delete().eq('user_id', user.id).eq('id', id);

    if (error) throw error;
  } catch (error) {
    res.status(500).json({ message: '刪除 Todo 失敗' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

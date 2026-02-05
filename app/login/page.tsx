'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody } from '@heroui/card';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { useAuth } from '@/lib/AuthContext';
import { Sun } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Preencha todos os campos');
      setIsLoading(false);
      return;
    }

    const success = await login(email, password);
    
    if (success) {
      router.push('/home');
    } else {
      setError('Erro ao fazer login. Tente novamente.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-emerald-50 to-[#156362]/10 p-4">
      <div className="mb-8 flex flex-col items-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#1f7e7b] to-[#156362] shadow-lg">
          <Sun className="h-12 w-12 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-[#012d2e]">Sol Conectividade</h1>
      </div>

      <Card className="w-full max-w-sm shadow-xl">
        <CardBody className="gap-4 p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="email"
              label="Email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isRequired
              variant="bordered"
            />
            
            <Input
              type="password"
              label="Senha"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isRequired
              variant="bordered"
            />

            {error && (
              <p className="text-center text-sm text-danger">{error}</p>
            )}

            <Button
              type="submit"
              color="success"
              size="lg"
              className="mt-2 font-semibold text-white"
              isLoading={isLoading}
            >
              Entrar
            </Button>
          </form>
        </CardBody>
      </Card>

      <p className="mt-6 text-center text-sm text-[#156362]">
        Use qualquer email e senha para entrar
      </p>
    </div>
  );
}

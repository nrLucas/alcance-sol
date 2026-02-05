'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Input, Textarea } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';
import { Button } from '@heroui/button';
import { addToast } from '@heroui/toast';
import { Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { 
  addMessage, 
  generateId, 
  formatMessageContent, 
  createWhatsAppLink 
} from '@/lib/storage';
import { MOTIVO_OPTIONS, MessageItem } from '@/lib/types';

export default function ReportPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    motivo: '',
    contatoAlternativo: '',
    mensagem: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    if (!formData.motivo) {
      newErrors.motivo = 'Motivo é obrigatório';
    }
    if (!formData.mensagem.trim()) {
      newErrors.mensagem = 'Mensagem é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Get motivo label
      const motivoOption = MOTIVO_OPTIONS.find(o => o.value === formData.motivo);
      const motivoLabel = motivoOption?.label || formData.motivo;

      // Format the message content
      const content = formatMessageContent({
        ...formData,
        motivo: motivoLabel,
      });

      // Create message item
      const message: MessageItem = {
        id: generateId(),
        timestamp: Date.now(),
        nome: formData.nome,
        motivo: motivoLabel,
        contatoAlternativo: formData.contatoAlternativo,
        mensagem: formData.mensagem,
        content,
        status: 'queued',
      };

      // Save to IndexedDB
      await addMessage(message);

      // Get WhatsApp number from env
      const waNumber = process.env.NEXT_PUBLIC_SUPPORT_WA_NUMBER || '5562993373278';
      
      // Create WhatsApp link
      const waLink = createWhatsAppLink(content, waNumber);

      // Open WhatsApp
      window.open(waLink, '_blank');

      // Show success toast
      addToast({
        title: 'Mensagem salva!',
        description: 'Redirecionando para o WhatsApp...',
        color: 'success',
      });

      // Navigate to history
      setTimeout(() => {
        router.push('/history');
      }, 1000);
    } catch (error) {
      console.error('Error saving message:', error);
      addToast({
        title: 'Erro',
        description: 'Não foi possível salvar a mensagem. Tente novamente.',
        color: 'danger',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col p-4">
      {/* Back button */}
      <Link href="/home" className="mb-4 flex items-center gap-2 text-[#156362]">
        <ArrowLeft className="h-5 w-5" />
        <span>Voltar</span>
      </Link>

      <Card className="shadow-lg">
        <CardHeader className="flex-col items-start gap-1 px-6 pt-6">
          <h1 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
            Reportar Problema
          </h1>
          <p className="text-sm text-zinc-500">
            Preencha os dados abaixo e envie via WhatsApp
          </p>
        </CardHeader>

        <CardBody className="px-6 pb-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Nome"
              placeholder="Seu nome completo"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              isRequired
              isInvalid={!!errors.nome}
              errorMessage={errors.nome}
              variant="bordered"
            />

            <Select
              label="Motivo"
              placeholder="Selecione o motivo"
              selectedKeys={formData.motivo ? [formData.motivo] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                setFormData({ ...formData, motivo: value });
              }}
              isRequired
              isInvalid={!!errors.motivo}
              errorMessage={errors.motivo}
              variant="bordered"
            >
              {MOTIVO_OPTIONS.map((option) => (
                <SelectItem key={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </Select>

            <Input
              label="Contato alternativo"
              placeholder="Telefone ou email (opcional)"
              value={formData.contatoAlternativo}
              onChange={(e) => setFormData({ ...formData, contatoAlternativo: e.target.value })}
              variant="bordered"
            />

            <Textarea
              label="Mensagem"
              placeholder="Descreva o problema com detalhes..."
              value={formData.mensagem}
              onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
              isRequired
              isInvalid={!!errors.mensagem}
              errorMessage={errors.mensagem}
              minRows={4}
              variant="bordered"
            />

            <Button
              type="submit"
              color="success"
              size="lg"
              className="mt-2 font-semibold"
              isLoading={isSubmitting}
              startContent={!isSubmitting && <Send className="h-5 w-5" />}
            >
              Enviar no WhatsApp
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

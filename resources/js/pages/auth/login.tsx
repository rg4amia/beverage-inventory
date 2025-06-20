import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Card, CardContent } from '@/components/ui/card';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout
            title="Connexion"
            description="Accédez à votre espace de gestion."
        >
            <Head title="Connexion" />

            <div className="flex justify-center items-center min-h-[60vh]">
                <Card className="w-full max-w-sm">
                    <CardContent className="py-6">
                        <form className="flex flex-col gap-4" onSubmit={submit}>
                            <div className="grid gap-4">
                                <div className="grid gap-1">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="votre@email.com"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-1">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Mot de passe</Label>
                                        {canResetPassword && (
                                            <TextLink href={route('password.request')} className="ml-auto text-xs" tabIndex={5}>
                                                Mot de passe oublié ?
                                            </TextLink>
                                        )}
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        checked={data.remember}
                                        onClick={() => setData('remember', !data.remember)}
                                        tabIndex={3}
                                    />
                                    <Label htmlFor="remember" className="text-xs">Se souvenir de moi</Label>
                                </div>

                                <Button type="submit" className="mt-2 w-full" tabIndex={4} disabled={processing} size="sm">
                                    {processing && <LoaderCircle className="w-4 h-4 animate-spin" />}
                                    Se connecter
                                </Button>
                            </div>

                            <div className="text-xs text-center text-muted-foreground">
                                Pas de compte ?{' '}
                                <TextLink href={route('register')} tabIndex={5}>
                                    S'inscrire
                                </TextLink>
                            </div>
                        </form>
                        {status && <div className="mt-2 text-xs font-medium text-center text-green-600">{status}</div>}
                    </CardContent>
                </Card>
            </div>
        </AuthLayout>
    );
}

import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    description: '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('categories.store'));
  };

  return (
    <AppLayout>
      <Head title="Nouvelle catégorie" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6">
              <h2 className="mb-6 text-2xl font-semibold text-cave-bordeaux">Nouvelle catégorie</h2>

              <form onSubmit={submit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    value={data.name}
                    className="block mt-1 w-full"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('name', e.target.value)}
                    required
                  />
                  <InputError message={errors.name} className="mt-2" />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    name="description"
                    value={data.description}
                    className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-cave-bordeaux focus:ring-cave-bordeaux"
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                    rows={3}
                  />
                  <InputError message={errors.description} className="mt-2" />
                </div>

                <div className="flex justify-end items-center">
                  <Button
                    type="submit"
                    className="ml-4"
                    disabled={processing}
                  >
                    Créer la catégorie
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

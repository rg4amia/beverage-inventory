<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;

class CreateStorageLink extends Command
{
    protected $signature = 'storage:link-custom';
    protected $description = 'Create a symbolic link from public/storage to storage/app/public';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $filesystem = new Filesystem;
        $target = storage_path('app/public');
        $link = public_path('storage');

        if ($filesystem->exists($link)) {
            $this->error('The "public/storage" directory already exists.');
            return;
        }

        try {
            // Attempt to create the symbolic link
            $filesystem->link($target, $link);
            $this->info('The [public/storage] directory has been linked.');
        } catch (\Exception $e) {
            // Fallback: Copy directory contents instead of linking
            $this->info('Symbolic link creation failed. Copying storage contents instead.');
            $filesystem->copyDirectory($target, $link);
            $this->info('The [public/storage] directory has been copied.');
        }
    }
}

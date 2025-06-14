<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActionLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'action',
        'date_heure',
    ];

    protected $casts = [
        'date_heure' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

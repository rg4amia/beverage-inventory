<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
  public function login(Request $request)
  {

    $request->validate([
      'email' => 'required|email',
      'password' => 'required',
      //'device_name' => 'required',
    ]);

    //dd($request->all());

    $user = User::where('email', $request->email)->first();

    logger()->info('Login attempt', [
      'email' => $request->email,
      'password' => $request->password,
     // 'device_name' => $request->device_name,
    ]);

    if (!$user || !Hash::check($request->password, $user->password)) {
      throw ValidationException::withMessages([
        'email' => ['Les identifiants fournis sont incorrects.'],
      ]);
    }

    return response()->json([
      'token' => $user->createToken($request->password)->plainTextToken,
      'user' => $user
    ]);
  }

  public function logout(Request $request)
  {
    $request->user()->currentAccessToken()->delete();

    return response()->json(['message' => 'Déconnexion réussie']);
  }
}

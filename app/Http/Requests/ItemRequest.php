<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ItemRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name'      => 'required|string|max:50',
            'item_code' => [
                'required',
                'string',
                'max:20',
                Rule::unique('items', 'item_code')->ignore($this->route('item'), 'id'),
            ],
            'price'     => 'required|integer|min:0',
            'stock'     => 'required|integer|min:0',
        ];
    }
}

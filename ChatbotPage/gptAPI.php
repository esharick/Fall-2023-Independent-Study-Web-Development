<?php

$message = $_POST['message'];

require_once('apikey.php');
require_once ($_SERVER['DOCUMENT_ROOT'] .'/vendor/autoload.php');

$endpoint = 'https://api.openai.com/v1/chat/completions';

$client = OpenAI::client($api_key);

$result = $client->chat()->create([
    'model' => 'gpt-3.5-turbo-1106',
    'messages' => [
        ['role' => 'user', 'content' => $message],
    ],
]);

echo $result->choices[0]->message->content;



?>

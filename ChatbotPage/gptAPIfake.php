<?php

$message = $_POST['message'];

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
use OpenAI\Testing\ClientFake;
use OpenAI\Responses\Completions\CreateResponse;

$client = new ClientFake([
    CreateResponse::fake([
        'choices' => [
            [
                'text' => 'awesome!',
            ],
        ],
    ]),
]);

$completion = $client->completions()->create([
    'model' => 'gpt-3.5-turbo-instruct',
    'prompt' => $message ,
]);

echo ($completion['choices'][0]['text']);

?>
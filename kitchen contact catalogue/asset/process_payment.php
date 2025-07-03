<?php
header('Content-Type: application/json');

// Verify Paystack payment
function verifyPayment($reference) {
    $curl = curl_init();
    $secret_key = "sk_test_your_secret_key"; // Replace with your Paystack secret key
    
    curl_setopt_array($curl, array(
        CURLOPT_URL => "https://api.paystack.co/transaction/verify/" . rawurlencode($reference),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            "accept: application/json",
            "authorization: Bearer " . $secret_key,
            "cache-control: no-cache"
        ],
    ));
    
    $response = curl_exec($curl);
    $err = curl_error($curl);
    curl_close($curl);
    
    if ($err) {
        return ['error' => true, 'message' => $err];
    } else {
        return json_decode($response, true);
    }
}

// Process the payment data
$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($data['payment'])) {
    $paymentData = $data['payment'];
    $orderItems = $data['items'];
    
    // Verify the payment with Paystack
    $verification = verifyPayment($paymentData['reference']);
    
    if (isset($verification['data']) && $verification['data']['status'] === 'success') {
        // Payment is successful
        
        // Save order to database (you'll need to implement this)
        // saveOrderToDatabase($verification['data'], $orderItems);
        
        // Send confirmation email (implement this)
        // sendConfirmationEmail($verification['data']['customer']['email'], $orderItems);
        
        echo json_encode([
            'success' => true,
            'message' => 'Payment verified and order processed',
            'data' => $verification['data']
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Payment verification failed',
            'error' => $verification['message'] ?? 'Unknown error'
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request'
    ]);
}

// Example database save function (you need to implement properly)
function saveOrderToDatabase($paymentData, $items) {
    // Connect to your database
    // $db = new PDO(...);
    
    // Prepare order data
    $orderData = [
        'reference' => $paymentData['reference'],
        'amount' => $paymentData['amount'] / 100,
        'customer_email' => $paymentData['customer']['email'],
        'items' => json_encode($items),
        'payment_date' => date('Y-m-d H:i:s')
    ];
    
    // Insert into database
    // $stmt = $db->prepare("INSERT INTO orders (...) VALUES (...)");
    // $stmt->execute($orderData);
    
    // Return order ID
    // return $db->lastInsertId();
}
?>
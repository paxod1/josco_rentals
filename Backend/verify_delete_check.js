const axios = require('axios');

const API_URL = 'http://localhost:8000/api';
const CREDENTIALS = {
    username: 'Josco',
    password: 'josco123'
};

async function runVerification() {
    console.log('🚀 Starting Verification: Prevent Delete on Active Rental');

    try {
        // 1. Login
        console.log('\n🔐 Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, CREDENTIALS);
        const token = loginRes.data.token;
        console.log('✅ Login successful');

        const authHeaders = {
            headers: { Authorization: `Bearer ${token}` }
        };

        // 2. Create Product
        console.log('\n📦 Creating Test Product...');
        const productRes = await axios.post(`${API_URL}/products`, {
            name: `Test_Delete_Check_${Date.now()}`,
            quantity: 10,
            rate: 100,
            rateType: 'daily'
        }, authHeaders);
        const productId = productRes.data._id;
        console.log(`✅ Product Created: ${productRes.data.name} (${productId})`);

        // 3. Create Rental
        console.log('\n🤝 Creating Active Rental...');
        const rentalRes = await axios.post(`${API_URL}/rentals`, {
            customerName: 'Test Customer',
            customerPhone: '1234567890',
            startDate: new Date(),
            productItems: [
                {
                    productId: productId,
                    quantity: 5
                }
            ]
        }, authHeaders);
        const rentalId = rentalRes.data._id;
        console.log(`✅ Rental Created: ${rentalId}`);

        // 4. Attempt Delete (Should Fail)
        console.log('\n❌ Attempting to DELETE product (Expect Failure)...');
        try {
            await axios.delete(`${API_URL}/products/${productId}`, authHeaders);
            console.error('❌ FAILED: Product was deleted but should have been blocked!');
            process.exit(1);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log(`✅ SUCCESS: Delete blocked with message: "${error.response.data.message}"`);
            } else {
                console.error('❌ FAILED: Unexpected error:', error.message);
                process.exit(1);
            }
        }

        // 5. Return Rental
        console.log('\n🔄 Returning Rental...');
        await axios.put(`${API_URL}/rentals/${rentalId}/return`, {
            productId: productId,
            returnQuantity: 5
        }, authHeaders);
        console.log('✅ Rental Returned');

        // 6. Attempt Delete (Should Success)
        console.log('\n🗑️ Attempting to DELETE product (Expect Success)...');
        try {
            await axios.delete(`${API_URL}/products/${productId}`, authHeaders);
            console.log('✅ SUCCESS: Product deleted successfully');
        } catch (error) {
            console.error('❌ FAILED: Could not delete product after return:', error.response?.data?.message || error.message);
            process.exit(1);
        }

        console.log('\n🎉 Verification Completed Successfully!');

    } catch (error) {
        console.error('❌ Verification Script Failed:', error.message);
        if (error.response) {
            console.error('Response Data:', error.response.data);
        }
    }
}

runVerification();

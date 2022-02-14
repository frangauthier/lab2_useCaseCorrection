const axios = require('axios')
const { Antony, Barry, Catherine, Drew, Emily } = require('./athletes')

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000'

const results = []

async function runUseCases() {
    try {
        await wipeAthletesData();
        await useCase1();
        await wipeAthletesData();
        await useCase2();
        await wipeAthletesData();
        await useCase3();
        await wipeAthletesData();
        await useCase4();
    } catch (err) {
        console.error('Error on use case 1')
        console.error(err)
    }
}

/**
 * Delete all athletes
 */
async function wipeAthletesData() {

    const reqOptions = {
        method: 'delete',
        url: `${SERVER_URL}/athlete/wipe`,
    }

    const response = await axios(reqOptions)

    return response.status
}

/**
 * Use case 1
 * Create a new athlete
 * Get all athletes
 * Get one athlete with id
 */
async function useCase1() {

    let score = 0
    const feedback = []

    const req1Options = {
        method: 'post',
        url: `${SERVER_URL}/athlete`,
        data: Barry
    }

    const response1 = await axios(req1Options)

    if (response1.status === 201) {
        score += 10 // 10/100
    } else {
        feedback.push('POST status code is not 201')
    }

    let createdId

    if (response1.data && response1.data.id) {
        score += 10 // 20/100
        createdId = response1.data.id
    } else {
        feedback.push('No id in POST response body')
    }

    const req2Options = {
        method: 'get',
        url: `${SERVER_URL}/athletes`,
    }

    const response2 = await axios(req2Options)

    if (response2.status === 200) {
        score += 10 // 30/100
    } else {
        feedback.push('GET all athlete status code is not 200')
    }

    if (response2.data && response2.data.athletes) {
        score += 10 // 40/100
    } else {
        feedback.push('GET all athletes response does not contain athletes arrays')
    }

    let hasOneAthlete = false;
    if (response2.data && response2.data.athletes && response2.data.athletes.length === 1) {
        hasOneAthlete = true;
        score += 10 // 50/100
    } else {
        feedback.push('GET all athletes response contains more than 1 athlete')
    }

    if (hasOneAthlete && response2.data.athletes[0].id === createdId) {
        score += 5 // 55/100
    } else {
        feedback.push('GET all athletes response does not contain proper athlete data')
    }

    if (hasOneAthlete && response2.data.athletes[0].lastName === Barry.lastName) {
        score += 10 // 65/100
    } else {
        feedback.push('GET all athletes response does not contain proper athlete data')
    }

    if (!createdId) {
        results.push({
            score,
            feedback: feedback.join('; '),
        })
        return
    }

    const req3Options = {
        method: 'get',
        url: `${SERVER_URL}/athlete/${createdId}`,
    }

    const response3 = await axios(req3Options)

    if (response3.status === 200) {
        score += 10 // 75/100
    } else {
        feedback.push('GET a athlete with id status code is not 200')
    }

    if (response3.data && response3.data.id === createdId) {
        score += 5 // 80/100
    } else {
        feedback.push('GET an athlete with id does not contain id')
    }

    if (response3.data && response3.data.firstName === Barry.firstName) {
        score += 10 // 90/100
    } else {
        feedback.push('GET an athlete with id does not contain first name')
    }

    if (response3.data && Object.keys(response3.data).length === Object.keys(Barry).length + 1) {
        score += 10 // 100/100
    } else {
        feedback.push('GET an athlete with id does not contain all fields')
    }

    results.push({
        score,
        feedback: feedback.join('; '),
    })
}

/**
 * Use case 2
 * Create 3 new athletes
 * Get all athletes
 * Get athletes by lastName
 */
async function useCase2() {

    let score = 0
    const feedback = []

    const req1Options = {
        method: 'post',
        url: `${SERVER_URL}/athlete`,
        data: Barry
    }

    const response1 = await axios(req1Options)

    if (response1.status === 201) {
        score += 10 // 10/100
    } else {
        feedback.push('POST status code is not 201')
    }

    if (response1.data && response1.data.id) {
        score += 5 // 15/100
    } else {
        feedback.push('POST response data does not contain created id')
    }

    const req2Options = {
        method: 'post',
        url: `${SERVER_URL}/athlete`,
        data: Catherine
    }

    const response2 = await axios(req2Options)

    if (response2.status === 201) {
        score += 10 // 25/100
    } else {
        feedback.push('POST status code is not 201')
    }

    if (response2.data && response2.data.id) {
        score += 5 // 30/100
    } else {
        feedback.push('POST response data does not contain created id')
    }

    const req3Options = {
        method: 'post',
        url: `${SERVER_URL}/athlete`,
        data: Emily
    }

    const response3 = await axios(req3Options)

    if (response3.status === 201) {
        score += 10 // 40/100
    } else {
        feedback.push('POST status code is not 201')
    }

    if (response3.data && response3.data.id) {
        score += 5 // 45/100
    } else {
        feedback.push('POST response data does not contain created id')
    }

    const req4Options = {
        method: 'get',
        url: `${SERVER_URL}/athletes`
    }

    const response4 = await axios(req4Options)

    if (response4.status === 200) {
        score += 10 // 55/100
    } else {
        feedback.push('GET athletes status code is not 200')
    }

    let contains3Athletes = false;
    if (response4.data && response4.data.athletes && response4.data.athletes.length === 3) {
        score += 10 // 65/100
        contains3Athletes = true;
    } else {
        feedback.push('GET athletes does not contain 3 athletes')
    }

    if (contains3Athletes) {
        const athletes = response4.data.athletes
        if (athletes.find(athlete => (athlete.firstName === Barry.firstName && athlete.lastName === Barry.lastName))) {
            score += 5 // 70/100
        } else {
            feedback.push('GET athletes could not find athlete Barry')
        }
        if (athletes.find(athlete => (athlete.firstName === Catherine.firstName && athlete.lastName === Catherine.lastName))) {
            score += 5 // 75/100
        } else {
            feedback.push('GET athletes could not find athlete Catherine')
        }
        if (athletes.find(athlete => (athlete.firstName === Emily.firstName && athlete.lastName === Emily.lastName))) {
            score += 5 // 80/100
        } else {
            feedback.push('GET athletes could not find athlete Emily')
        }
    }

    // GET search
    const req5Options = {
        method: 'get',
        url: `${SERVER_URL}/athletes/search?lastName=${Catherine.lastName}`
    }

    const response5 = await axios(req5Options)

    if (response5.status === 200) {
        score += 5 // 85/100
    } else {
        feedback.push('GET athletes search status code is not 200')
    }

    if (response5.data && response5.data.athletes && response5.data.athletes.length === 2) {
        score += 5 // 90/100
        const athletes = response5.data.athletes
        if (athletes.find(athlete => (athlete.firstName === Catherine.firstName && athlete.lastName === Catherine.lastName))) {
            score += 5 // 95/100
        } else {
            feedback.push('GET athletes search could not find athlete Catherine')
        }
        if (athletes.find(athlete => (athlete.firstName === Emily.firstName && athlete.lastName === Emily.lastName))) {
            score += 5 // 100/100
        } else {
            feedback.push('GET athletes search could not find athlete Emily')
        }
    } else {
        feedback.push('GET athletes search does not contain 2 athletes')
    }

    results.push({
        score,
        feedback: feedback.join('; '),
    })
}

/**
 * Use case 3
 * Create 1 new athlete
 * Get one athlete by id
 * Delete the athlete
 * Get athlete -> 404
 */
async function useCase3() {

    let score = 0
    const feedback = []

    const req1Options = {
        method: 'post',
        url: `${SERVER_URL}/athlete`,
        data: Antony
    }

    const response1 = await axios(req1Options)

    if (response1.status === 201) {
        score += 10 // 10/100
    } else {
        feedback.push('POST status code is not 201')
    }

    let createdId;
    if (response1.data && response1.data.id) {
        createdId = response1.data.id
        score += 5 // 15/100
    } else {
        feedback.push('POST response data does not contain created id')
    }

    if (!createdId) {
        results.push({
            score,
            feedback: feedback.join('; '),
        })
        return
    }

    const req2Options = {
        method: 'get',
        url: `${SERVER_URL}/athlete/${createdId}`,
    }

    const response2 = await axios(req2Options)

    if (response2.status && response2.status === 200) {
        score += 10 // 25/100
    } else {
        feedback.push('GET athlete by id status is not 200')
    }

    if (response2.data && response2.data && (response2.data.firstName === Antony.firstName)) {
        score += 10 // 35/100
    } else {
        feedback.push('GET athlete by id response data does not contain athlete data')
    }

    const req3Options = {
        method: 'delete',
        url: `${SERVER_URL}/athlete/${createdId}`,
    }

    const response3 = await axios(req3Options)

    if (response3.status && response3.status === 200) {
        score += 20 // 55/100
    } else {
        feedback.push('DELETE athlete by id status is not 200')
    }

    const req4Options = {
        method: 'get',
        url: `${SERVER_URL}/athlete/${createdId}`,
    }

    let response4;
    try {
        response4 = await axios(req4Options)
    } catch (err) {
        response4 = err.response;
    } finally {
        if (response4.status && response4.status === 404) {
            score += 15 // 65/100
        } else {
            feedback.push('GET athlete by id status is not 404 after delete')
        }
    }


    const req5Options = {
        method: 'patch',
        url: `${SERVER_URL}/athlete/${createdId}`,
    }

    let response5;
    try {
        response5 = await axios(req5Options)
    } catch (err) {
        response5 = err.response;
    } finally {
        if (response5.status && response5.status === 404) {
            score += 15 // 75/100
        } else {
            feedback.push('PUT athlete by id status is not 404 after delete')
        }
    }

    const req6Options = {
        method: 'get',
        url: `${SERVER_URL}/athletes`,
    }

    const response6 = await axios(req6Options)

    if (response6.status && response6.status === 200) {
        score += 5 // 90/100
    } else {
        feedback.push('GET all athletes status is not 200 after delete')
    }

    if (response6.data && response6.data.athletes && response6.data.athletes.length === 0) {
        score += 10 // 100/100
    } else {
        feedback.push('GET all athletes contain an athlete after delete')
    }

    results.push({
        score,
        feedback: feedback.join('; '),
    })
}

/**
 * Use case 4
 * Create 2 new athletes
 * Patch one athlete by id
 * Put one athlete by id
 * Put one athlete by id (non-existing)
 * Get all athletes
 */
async function useCase4() {

    let score = 0
    const feedback = []

    const req1Options = {
        method: 'post',
        url: `${SERVER_URL}/athlete`,
        data: Antony
    }

    // Create first athlete
    const response1 = await axios(req1Options)

    if (response1.status === 201) {
        score += 10 // 10/100
    } else {
        feedback.push('POST status code is not 201')
    }

    let createdId1;
    if (response1.data && response1.data.id) {
        createdId1 = response1.data.id
        score += 5 // 15/100
    } else {
        feedback.push('POST response data does not contain created id')
    }

    const req2Options = {
        method: 'post',
        url: `${SERVER_URL}/athlete`,
        data: Catherine
    }

    // Create second athlete
    const response2 = await axios(req2Options)

    if (response2.status === 201) {
        score += 10 // 25/100
    } else {
        feedback.push('POST status code is not 201')
    }

    let createdId2;
    if (response2.data && response2.data.id) {
        createdId2 = response2.data.id
        score += 5 // 30/100
    } else {
        feedback.push('POST response data does not contain created id')
    }

    const req3Options = {
        method: 'patch',
        url: `${SERVER_URL}/athlete/${createdId1}`,
        data: {
            isCanadianCitizen: true,
            age: 32,
        }
    }

    const response3 = await axios(req3Options)

    if (response3.status === 200) {
        score += 5 // 35/100
    } else {
        feedback.push('PATCH status code is not 200')
    }

    if (response3.data && response3.data.isCanadianCitizen && response3.data.age == 32) {
        score += 10 // 45/100
    } else {
        feedback.push('PATCH response data does not contain updated fields')
    }

    const req4Options = {
        method: 'put',
        url: `${SERVER_URL}/athlete/${createdId2}`,
        data: Emily
    }

    const response4 = await axios(req4Options)

    if (response4.status === 200) {
        score += 5 // 50/100
    } else {
        feedback.push('PUT status code is not 200')
    }

    if (response4.data && response4.data.firstName === Emily.firstName) {
        score += 10 // 60/100
    } else {
        feedback.push('PUT response data does not contain updated fields')
    }

    let id3 = createdId2 + 152469;
    const req5Options = {
        method: 'put',
        url: `${SERVER_URL}/athlete/${id3}`,
        data: Drew
    }

    const response5 = await axios(req5Options)

    if (response5.status === 201) {
        score += 5 // 65/100
    } else {
        feedback.push('PUT status code is not 201')
    }

    if (response5.data && response5.data.id && response5.data.id == id3) {
        score += 10 // 75/100
    } else {
        feedback.push('PUT response data does not contain id field')
    }

    const req6Options = {
        method: 'get',
        url: `${SERVER_URL}/athletes`,
    }

    const response6 = await axios(req6Options)

    if (response6.status === 200) {
        score += 5 // 80/100
    } else {
        feedback.push('Get all athletes status code is not 200')
    }

    let hasAthletes = false
    if (response6.data && response6.data.athletes) {
        hasAthletes = true
        if (response6.data.athletes.length === 3) {
            score += 5 // 85/100
        }
    } else {
        feedback.push('GET all athletes response data does not contain athletes field')
    }

    if (hasAthletes) {
        const athletes = response6.data.athletes
        const athlete1 = athletes.find((athlete) => athlete.id == createdId1)
        const athlete2 = athletes.find((athlete) => athlete.id == createdId2)
        const athlete3 = athletes.find((athlete) => athlete.id == id3)
        if (athlete1 && athlete1.isCanadianCitizen) {
            score += 5 // 90/100
        } else {
            feedback.push('Athlete 1 was not updated')
        }
        if (athlete2 && athlete2.lastName === Emily.lastName) {
            score += 5 // 95/100
        } else {
            feedback.push('Athlete 2 was not updated')
        }
        if (athlete3) {
            score += 5 // 100/100
        } else {
            feedback.push('Athlete 3 was not created')
        }
    }

    results.push({
        score,
        feedback: feedback.join('; '),
    })
}
// MAIN - ran when called `node correction.js`
(async() => {
    await runUseCases()

    results.forEach((result, index) => {
        console.log(`UseCase${index + 1} score: ${result.score}/100, feedback: ${result.feedback}`)
    })
})()
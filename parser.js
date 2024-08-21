const cheerio = require('cheerio');

async function parseHtml(html) {
  const $ = cheerio.load(html);

  // Extract JSON-LD data
  let jsonLdData = [];
  $('script[type="application/ld+json"]').each((index, element) => {
    try {
      const jsonData = JSON.parse($(element).html());
      jsonLdData.push(jsonData);
    } catch (error) {
      console.error('Error parsing JSON-LD:', error);
    }
  });

  // Filter and format events
  let events = jsonLdData.filter((schema) =>
    (schema["@context"] === "https://schema.org" || schema["@context"] === "http://schema.org") &&
    [
      'Event', 'BusinessEvent', 'ChildrensEvent', 'ComedyEvent', 'CourseInstance',
      'DanceEvent', 'DeliveryEvent', 'EducationEvent', 'ExhibitionEvent', 'Festival',
      'FoodEvent', 'LiteraryEvent', 'MusicEvent', 'PublicationEvent', 'SaleEvent',
      'ScreeningEvent', 'SocialEvent', 'SportsEvent', 'TheaterEvent', 'VisualArtsEvent'
    ].includes(schema["@type"])
  );

  // Extract meta tag data
  let metaTagsData = {};
  $('meta').each((index, element) => {
    const key = $(element).attr("property") || $(element).attr("name");
    const content = $(element).attr("content");
    if (key && content) {
      metaTagsData[key] = content;
    }
  });

  let formattedEvents = events.map((schema) => {
    let eventData = {
      banner_url: metaTagsData['og:image'],
      eventname: schema["name"],
      description: schema["description"],
      start_time: schema["startDate"],
      end_time: schema["endDate"],
      venue: schema["location"] ? schema["location"]["name"] : undefined,
      address: schema["location"] ? schema["location"]["address"] : undefined,
      city: schema["location"] && schema["location"]["address"] ? schema["location"]["address"]["addressLocality"] : undefined,
      state: schema["location"] && schema["location"]["address"] ? schema["location"]["address"]["addressRegion"] : undefined,
      country: schema["location"] && schema["location"]["address"] ? schema["location"]["address"]["addressCountry"] : undefined,
      ticket_url: schema["url"],
      video_url: schema["video"],
      organizer_id: schema["organizer"] ? schema["organizer"]["@id"] : undefined,
      latitude: schema["location"] && schema["location"]["geo"] ? schema["location"]["geo"]["latitude"] : undefined,
      longitude: schema["location"] && schema["location"]["geo"] ? schema["location"]["geo"]["longitude"] : undefined,
    };

    // Check for missing data and try to fill from meta tags
    if (!eventData.banner_url) schema["image"];
    if (!eventData.eventname) eventData.eventname = metaTagsData['og:title'] || metaTagsData['twitter:title'];
    if (!eventData.description) eventData.description = metaTagsData['og:description'] || metaTagsData['twitter:description'] || metaTagsData['description'];
    if (!eventData.start_time) eventData.start_time = metaTagsData['event:start_time'];
    if (!eventData.end_time) eventData.end_time = metaTagsData['event:end_time'];
    if (!eventData.venue) eventData.venue = metaTagsData['og:site_name'];
    if (!eventData.address) eventData.address = metaTagsData['og:street-address'];
    if (!eventData.city) eventData.city = metaTagsData['og:locality'] || metaTagsData['place:locality'] || metaTagsData['geo.placename'];
    if (!eventData.state) eventData.state = metaTagsData['og:region'] || metaTagsData['place:region'];
    if (!eventData.country) eventData.country = metaTagsData['og:country-name'] || metaTagsData['place:country'];
    if (!eventData.ticket_url) eventData.ticket_url = metaTagsData['og:url'];
    if (!eventData.video_url) eventData.video_url = metaTagsData['og:video'];
    if (!eventData.latitude) eventData.latitude = metaTagsData['place:location:latitude'];
    if (!eventData.longitude) eventData.longitude = metaTagsData['place:location:longitude'];

    // If we still don't have coordinates, try to parse from a combined meta tag
    if (!eventData.latitude || !eventData.longitude) {
      const geoposition = metaTagsData['geo.position'] || metaTagsData['ICBM'];
      if (geoposition) {
        const [lat, long] = geoposition.split(';');
        eventData.latitude = eventData.latitude || lat;
        eventData.longitude = eventData.longitude || long;
      }
    }

    return eventData;
  });

  return { formattedEvents, metaTagsData };
}

module.exports = { parseHtml };

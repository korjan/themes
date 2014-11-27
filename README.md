Themes
======
When recognizing specific spoken words / faces / text, play a theme song or video, with a little randomness.

Themes needs a TIM, a device with speakers, a screen and a webcam and can run standalone. 
Themes can be triggered via things that TIM recognizes or via the API.

Components
======
# Things TIM will observe
A bit of video, audio, image or text

# Things TIM recognizes
## Video / Image
- Faces
## Audio / Text
- Words
## Audience
- Who is near TIM
## Memory
- Things TIM said earlier.

# Things TIM will do
- Speakers: play an audio file
- Screens: display an image or video

Cloud API
======

Add an event for TIM to recognize:
Message:{creator, name, type, recognize, theme}
REST /api/v1/themes

An external process or detached TIM, a TIMd, could also want to trigger a theme, this could be done by calling:
Message: {event: recognize}
REST/api/v1/notify

TODO: add raw audio/video/text stream input
TODO: Authentication, connect to a specific TIM.io -> return key

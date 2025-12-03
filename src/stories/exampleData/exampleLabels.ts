import { Label } from '../../types'

const voc: Label[] = [
  {
    id: 2,
    name: 'Aeroplane',
    description: 'Includes gliders but not hang gliders or helicopters',
    color: '#a4527d',
  },
  {
    id: 3,
    name: 'Bicycle',
    description: 'Includes tricycles, unicycles',
    color: '#487b3b',
  },
  {
    id: 4,
    name: 'Bird',
    description: 'All birds',
    color: '#d44da4',
  },
  {
    id: 5,
    name: 'Boat',
    description: 'Ships, rowing boats, pedaloes but not jet skis',
    color: '#d5a442',
  },
  {
    id: 6,
    name: 'Bottle',
    description: 'Plastic, glass or feeding bottles',
    color: '#a55046',
  },
  {
    id: 7,
    name: 'Bus',
    description: 'Includes minibus but not trams',
    color: '#e28f81',
  },
  {
    id: 8,
    name: 'Car',
    description:
      "Includes cars, vans, large family cars for 6-8 people etc.\nExcludes go-carts, tractors, emergency vehicles, lorries/trucks etc.\nDo not label where only the vehicle interior is shown.\nInclude toys that look just like real cars, but not 'cartoony' toys.",
    color: '#5ab74d',
  },
  {
    id: 9,
    name: 'Cat',
    description: 'Domestic cats (not lions etc.)',
    color: '#7166d9',
  },
  {
    id: 10,
    name: 'Chair',
    description:
      'Includes armchairs, deckchairs but not stools or benches.\nExcludes seats in buses, cars etc.\nExcludes wheelchairs.',
    color: '#d14734',
  },
  {
    id: 11,
    name: 'Cow',
    description: 'All cows',
    color: '#cd8fd3',
  },
  {
    id: 12,
    name: 'Dining table',
    description:
      'Only tables for eating at.\nNot coffee tables, desks, side tables or picnic benches',
    color: '#d5a442',
  },
  {
    id: 13,
    name: 'Dog',
    description: 'Domestic dogs (not wolves etc.)',
    color: '#6360a7',
  },
  {
    id: 14,
    name: 'Horse',
    description: 'Includes ponies, donkeys, mules etc.',
    color: '#a4527d',
  },
  {
    id: 15,
    name: 'Motorbike',
    description: 'Includes mopeds, scooters, sidecars',
    color: '#a4527d',
  },
  {
    id: 16,
    name: 'Person',
    description: 'Includes babies, faces (i.e. truncated people)',
    color: '#12345',
  },
  {
    id: 17,
    name: 'Potted plant',
    description:
      'Indoor plants excluding flowers in vases, or outdoor plants clearly in a pot. ',
    color: '#a55046',
  },
  {
    id: 18,
    name: 'Sheep',
    description: 'Sheep, not goats',
    color: '#9cb067',
  },
  {
    id: 19,
    name: 'Sofa',
    description: 'Excludes sofas made up as sofa-beds',
    color: '#50b897',
  },
  {
    id: 20,
    name: 'Train',
    description: 'Includes train carriages, excludes trams',
    color: '#e28f81',
  },
  {
    id: 21,
    name: 'TV/monitor',
    description: 'Standalone screens (not laptops), not advertising displays',
    color: '#5ab74d',
  },
]

const minimal: Label[] = [
  {
    id: 1,
    name: 'Cat',
    description: 'Includes all cats',
  },
  {
    id: 2,
    name: 'Dog',
    description: 'Includes all dogs',
  },
]

export default {
  voc,
  minimal,
}

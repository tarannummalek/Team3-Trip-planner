import { defineStore } from "pinia";
import { ref } from "vue";

export const useStopStore = defineStore('stopStore', () => {
    const stops = ref([])
    const source = ref('')
    const destination = ref('')
    const tripId = ref(null); 
    function $reset() {
        source.value = '';
        destination.value = '';
        stops.value = [];
    }
    const addStop = (place) => {
        if(!stops.value.some(s => s.lat === place.lat && s.lon === place.lon)){
            stops.value.push(place)
        }
    }

    const removeStop = (index) => {
        stops.value.splice(index ,1)
    }

    const clearStops = () => {
        stops.value = []
    }

    return {stops, source, destination,addStop,removeStop,clearStops,$reset,tripId}
}
, {
    persist: true 
  }
)



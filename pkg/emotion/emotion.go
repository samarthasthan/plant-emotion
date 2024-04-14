package emotion

type EmotionalState int

const (
	Healthy EmotionalState = iota + 1
	Underwatered
	Overwatered
	TooLittleSunlight
	TooMuchSunlight
	TooCold
	TooHot
	TooDry
	TooHumid
	NutrientDeficiency
	NutrientExcess
	UnhealthyLowLeafMovement
	HealthyModerateLeafMovement
	UnhealthyHighLeafMovement
)

// String returns the string representation of the emotional state
func (e EmotionalState) String() string {
	return [...]string{
		"Healthy",
		"Underwatered",
		"Overwatered",
		"Too little sunlight",
		"Too much sunlight",
		"Too cold",
		"Too hot",
		"Too dry",
		"Too humid",
		"Nutrient deficiency",
		"Nutrient excess",
		"Unhealthy (Low leaf movement)",
		"Healthy (Moderate leaf movement)",
		"Unhealthy (High leaf movement)",
	}[e-1]
}

// EnumIndex returns the index of the enum value
func (e EmotionalState) EnumIndex() int {
	return int(e)
}

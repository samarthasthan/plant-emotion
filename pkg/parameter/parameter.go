package parameter

import "math/rand"

type Movement int

const (
	Low Movement = iota + 1
	Moderate
	High
)

func (m Movement) ToString() string {
	return [...]string{"Low", "Moderate", "High"}[m-1]
}

func (m Movement) EnumIndex() int {
	return int(m)
}

type Parameter struct {
	SoilMoisture   int
	LightIntensity int
	Temperature    int
	Humidity       int
	NutrientLevel  float32
	LeafMovement   Movement
}

func NewParameter() Parameter {
	return Parameter{}
}

func (p *Parameter) Random() *Parameter {
	p.SoilMoisture = rand.Intn(70-60) + 60
	p.LightIntensity = rand.Intn(1000-200) + 200
	p.Temperature = rand.Intn(50-40) + 40
	p.Humidity = rand.Intn(100-30) + 30
	p.NutrientLevel = rand.Float32() + float32(rand.Intn(5-2)+2)
	p.LeafMovement = Movement(rand.Intn(4-1) + 1)
	return p
}

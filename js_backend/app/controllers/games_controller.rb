class GamesController < ApplicationController
  before_action :set_game, only: [:show, :update, :destroy]

  # GET /games
  def index
    @games = Game.all

    render json: @games
  end

  # GET /games/1
  def show
    render json: @game
  end

  # POST /games
  def create
    @game = Game.new(game_params)
    if @game.save
      # binding.pry
      params[:genre_ids].each do |gen|
        genre = Genre.find_by_id(gen)
        @game.game_genres.create(genre_id: genre.id)
      end
      render json: @game, status: :created, location: @game
    else
      render json: @game.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /games/1
  def update
    if @game.update(game_params)
      new_arr = []
      params[:genre_ids].each do |gen|
        currentGameGenre = GameGenre.find_by(game_id: @game.id, genre_id: gen)
        if !currentGameGenre
          new_arr << @game.game_genres.create(genre_id: gen)
        else
          new_arr << currentGameGenre
        end
      end
      @game.game_genres = new_arr
      render json: @game
    else
      render json: @game.errors, status: :unprocessable_entity
    end
  end

  # DELETE /games/1
  def destroy
    GameGenre.where(game_id: @game.id).delete_all
    @game.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_game
      @game = Game.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def game_params
      params.require(:game).permit(:category_id, :title, :player_min, :player_max, :game_length, :challenge, genre_ids: [])
    end
end
